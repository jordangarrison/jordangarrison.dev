/**
 * generate-pdf.js
 *
 * Starts the Astro preview server, uses Playwright to generate resume PDFs,
 * then shuts the server down.
 *
 * Usage:
 *   node scripts/generate-pdf.js
 *
 * Requires: `astro build` to have been run first (dist/ must exist).
 *
 * Generates:
 *   - dist/resume.pdf       (condensed, professional-only)
 *   - dist/resume-full.pdf  (full CV with all content)
 */

import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { spawn } from 'child_process';

// Auto-detect Nix-managed Playwright browsers if PLAYWRIGHT_BROWSERS_PATH is not set
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  const nixStore = '/nix/store';
  try {
    const entries = readdirSync(nixStore).filter(
      (e) => e.includes('playwright-browsers') && !e.endsWith('.drv')
    );
    if (entries.length > 0) {
      const browsersPath = resolve(nixStore, entries[entries.length - 1]);
      process.env.PLAYWRIGHT_BROWSERS_PATH = browsersPath;
      console.log(`Auto-detected Nix Playwright browsers: ${browsersPath}`);
    }
  } catch {
    // Not on NixOS or no access to /nix/store — Playwright will use its default
  }
}

const DIST_DIR = resolve(process.cwd(), 'dist');

const PDF_PAGES = [
  { path: '/resume/print/', output: 'resume.pdf' },
  { path: '/resume/print/full/', output: 'resume-full.pdf' },
];

/**
 * Start the Astro preview server and return its URL + child process.
 * Parses the actual listening URL from stdout so we handle port conflicts.
 */
function startPreviewServer() {
  return new Promise((resolvePromise, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Preview server did not start within 30 seconds'));
    }, 30_000);

    const child = spawn('npx', ['astro', 'preview'], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    let stderr = '';

    child.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);

      // Astro prints: "┃ Local    http://localhost:XXXX/"
      const match = text.match(/Local\s+(https?:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        const baseUrl = match[1].replace(/\/$/, '');
        resolvePromise({ baseUrl, child });
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    child.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== null && code !== 0) {
        reject(new Error(`Preview server exited with code ${code}: ${stderr}`));
      }
    });
  });
}

/**
 * Wait for the server to respond successfully to an HTTP request.
 */
async function waitForServer(url, { timeout = 30_000, interval = 500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

async function generatePDFs() {
  // Verify dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Run "astro build" first.');
    process.exit(1);
  }

  // Start the preview server
  console.log('Starting preview server...');
  const { baseUrl, child: serverProcess } = await startPreviewServer();
  console.log(`Preview server running at ${baseUrl}`);

  // Wait for the server to be fully ready
  await waitForServer(baseUrl);

  // Launch headless Chromium
  // On NixOS, use the Nix-managed Chromium if available
  const nixChromium = process.env.PLAYWRIGHT_BROWSERS_PATH
    ? (() => {
        const browsersDir = process.env.PLAYWRIGHT_BROWSERS_PATH;
        const chromiumDirs = readdirSync(browsersDir).filter((d) => d.startsWith('chromium'));
        if (chromiumDirs.length > 0) {
          const chromePath = resolve(browsersDir, chromiumDirs[0], 'chrome-linux64', 'chrome');
          if (existsSync(chromePath)) return chromePath;
        }
        return undefined;
      })()
    : undefined;

  if (nixChromium) {
    console.log(`Using Nix Chromium: ${nixChromium}`);
  }

  const browser = await chromium.launch({
    headless: true,
    ...(nixChromium ? { executablePath: nixChromium } : {}),
  });
  const context = await browser.newContext();

  try {
    for (const { path, output } of PDF_PAGES) {
      const url = `${baseUrl}${path}`;
      const outputPath = resolve(DIST_DIR, output);

      console.log(`Generating ${output} from ${url}...`);

      const page = await context.newPage();

      // Navigate and wait for network to settle (ensures fonts are loaded)
      await page.goto(url, { waitUntil: 'networkidle' });

      // Generate PDF — the page CSS handles margins via @page
      await page.pdf({
        path: outputPath,
        format: 'Letter',
        printBackground: true,
        margin: {
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
        },
      });

      console.log(`  -> ${outputPath}`);
      await page.close();
    }

    console.log('PDF generation complete.');
  } finally {
    await browser.close();
    // Shut down the preview server
    serverProcess.kill('SIGTERM');
  }
}

generatePDFs().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
