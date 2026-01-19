# Sync Portfolio from GitHub Pinned Repos

Synchronize the portfolio page with pinned repositories from GitHub.

## Arguments

- `--dry-run`: Preview changes without modifying files
- `--interactive`: Prompt for category and features for each repo

## Instructions

1. **Fetch pinned repositories** using the GitHub GraphQL API:

```bash
gh api graphql -f query='
{
  user(login: "jordangarrison") {
    pinnedItems(first: 10, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          homepageUrl
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }
          releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              url
            }
          }
        }
      }
    }
  }
}'
```

2. **Read the current portfolio data** from `src/lib/portfolio.data.ts`

3. **For each pinned repository** (excluding `jordangarrison.dev`):

   a. **Determine the category** based on repository topics:
      - Topics containing `nix`, `nixos`, or `flake` → `nix` category
      - Topics containing `ai`, `claude`, `llm`, or `agents` → `ai` category
      - Default → `tools` category

   b. **Map GitHub data to portfolio structure**:
      - `name` → `title`
      - `description` → `description`
      - `url` → `githubUrl`
      - `homepageUrl` → `liveUrl` (if present)
      - `languages` → `techStack`
      - If releases exist → set `downloadUrl` to `{githubUrl}/releases/latest`

   c. **Generate features** by:
      - Fetching the README from the repository
      - Extracting key features/highlights (3-5 bullet points)
      - If no clear features found, generate based on description and tech stack

4. **Merge with existing data**:
   - For repos already in portfolio: Update description, techStack, liveUrl, downloadUrl
   - For new repos: Add to appropriate category with generated features
   - Preserve existing features unless they seem outdated
   - Preserve custom projects not from pinned repos

5. **Assign IDs**:
   - Keep existing IDs for existing projects
   - Assign next available ID for new projects

6. **Update the portfolio data file** (`src/lib/portfolio.data.ts`) with the merged data

7. **If `--dry-run`**: Output what changes would be made without writing files

8. **If `--interactive`**: For each new repo, prompt to confirm:
   - Category assignment
   - Generated features (allow editing)

## Example Output

```
Fetching pinned repositories...
Found 6 pinned repos

Processing repos:
✓ yoink (tools) - existing, updated description
✓ nix-config (nix) - existing, no changes
✓ agents (ai) - existing, updated techStack
+ new-project (tools) - new repo added
- jordangarrison.dev - skipped (self-exclusion)

Summary:
- Updated: 2 projects
- Added: 1 project
- Unchanged: 1 project
- Skipped: 1 repo

Run without --dry-run to apply changes.
```

## Notes

- Always preserve custom content that users have added
- The features array is the most valuable custom content - preserve it unless the repo has changed significantly
- Use AI judgment to categorize repos when topics are ambiguous
- Keep the output concise and actionable
