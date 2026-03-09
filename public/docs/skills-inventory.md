# Claude Code Skills Inventory

Last updated: 2026-03-09

## Global Skills

None. All skills have been moved to the project level so they are available to anyone who clones this repo.

## Project Skills (`.agents/skills/` → symlinked via `.claude/skills/`)

These are stored in the repo and available on any device after cloning.

| Skill | Source | Description |
|-------|--------|-------------|
| `image` | `vercel-labs/json-render` | JSON → SVG/PNG image generation via Satori |
| `find-skills` | `vercel-labs/skills` | Discover & install skills from skills.sh |
| `agent-browser` | `vercel-labs/agent-browser` | Browser automation via Playwright |
| `next-best-practices` | `vercel-labs/next-skills` | Next.js file conventions, RSC, data patterns, metadata, etc. |
| `payload` | `payloadcms/skills` | Payload CMS collections, hooks, access control, debugging |
| `product-marketing-context` | `coreyhaines31/marketingskills` | Set up product/ICP/positioning context for marketing tasks |
| `seo-audit` | `coreyhaines31/marketingskills` | SEO audit, technical SEO, Core Web Vitals, indexing issues |
| `vercel-react-best-practices` | `vercel-labs/agent-skills` | React/Next.js performance optimization from Vercel Engineering |
| `web-design-guidelines` | `vercel-labs/agent-skills` | UI review, accessibility audit, UX best practices |

## Built-in Claude Code Skills

These ship with Claude Code and are always available without installation.

| Skill | Description |
|-------|-------------|
| `skill-creator` | Create, edit, and benchmark skills |
| `simplify` | Review changed code for reuse, quality, and efficiency |
| `loop` | Run a prompt or command on a recurring interval |
| `claude-api` | Build apps with the Claude API / Anthropic SDK |
| `keybindings-help` | Customize keyboard shortcuts in `~/.claude/keybindings.json` |
| `claude-md-management` | Audit and improve CLAUDE.md files |
| `frontend-design` | Create production-grade frontend UI with high design quality |

## Manage Skills

```bash
# Search for skills
npx skills find <query>

# Install in project (recommended)
npx skills add <owner/repo@skill> -y

# Install globally (machine-only, not shared via repo)
npx skills add <owner/repo@skill> -g -y

# Remove a skill
npx skills remove <skill-name> -y

# Check for updates
npx skills check

# Update all
npx skills update
```

Browse all available skills at: https://skills.sh/
