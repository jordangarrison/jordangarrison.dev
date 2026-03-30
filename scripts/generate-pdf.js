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
 *
 * Skips gracefully if Chromium is not available (e.g. on Vercel CI).
 */

import { existsSync, readdirSync, copyFileSync, mkdirSync } from 'fs';
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
    // Not on NixOS or no access to /nix/store
  }
}

const DIST_DIR = resolve(process.cwd(), 'dist');

const PDF_PAGES = [
  { path: '/resume/print/', output: 'resume.pdf' },
  { path: '/resume/print/full/', output: 'resume-full.pdf' },
];

/**
 * Check if Playwright + Chromium are available.
 * Returns the chromium module and optional executablePath, or null if unavailable.
 */
async function getChromium() {
  let chromium;
  try {
    const pw = await import('playwright');
    chromium = pw.chromium;
  } catch {
    return null;
  }

  // On NixOS, find the Nix-managed Chromium executable
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
    try {
      const browsersDir = process.env.PLAYWRIGHT_BROWSERS_PATH;
      const chromiumDirs = readdirSync(browsersDir).filter((d) => d.startsWith('chromium'));
      if (chromiumDirs.length > 0) {
        const chromePath = resolve(browsersDir, chromiumDirs[0], 'chrome-linux64', 'chrome');
        if (existsSync(chromePath)) {
          return { chromium, executablePath: chromePath };
        }
      }
    } catch {
      // Fall through to default
    }
  }

  return { chromium, executablePath: undefined };
}

const PREVIEW_PORT = 14321;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

/**
 * Start the Astro preview server and return the child process.
 * Uses a fixed port and waits for it via HTTP polling instead of parsing stdout.
 */
function startPreviewServer() {
  const child = spawn('npx', ['astro', 'preview', '--port', String(PREVIEW_PORT)], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  child.stdout.on('data', (data) => process.stdout.write(data));
  child.stderr.on('data', (data) => process.stderr.write(data));

  child.on('error', (err) => {
    console.error('Preview server error:', err);
  });

  return child;
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

  // Check if Playwright + Chromium are available
  const chromiumInfo = await getChromium();
  if (!chromiumInfo) {
    console.log('Playwright not available — skipping PDF generation.');
    console.log('PDFs can be generated locally with: bun run generate-pdf');
    process.exit(0);
  }

  const { chromium, executablePath } = chromiumInfo;

  // Start the preview server
  console.log('Starting preview server...');
  const serverProcess = startPreviewServer();

  // Wait for the server to be fully ready
  console.log(`Waiting for server at ${PREVIEW_URL}...`);
  await waitForServer(PREVIEW_URL);
  console.log(`Preview server ready at ${PREVIEW_URL}`);

  // Launch headless Chromium
  if (executablePath) {
    console.log(`Using Nix Chromium: ${executablePath}`);
  }

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      ...(executablePath ? { executablePath } : {}),
    });
  } catch (err) {
    console.log(`Chromium launch failed — skipping PDF generation: ${err.message}`);
    console.log('PDFs can be generated locally with: bun run generate-pdf');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  }

  const context = await browser.newContext();

  try {
    for (const { path, output } of PDF_PAGES) {
      const url = `${PREVIEW_URL}${path}`;
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

    // Copy PDFs to public/ so they're committed and available on Vercel
    const publicDir = resolve(process.cwd(), 'public');
    mkdirSync(publicDir, { recursive: true });
    for (const { output } of PDF_PAGES) {
      const src = resolve(DIST_DIR, output);
      const dest = resolve(publicDir, output);
      copyFileSync(src, dest);
      console.log(`  -> copied to public/${output}`);
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
