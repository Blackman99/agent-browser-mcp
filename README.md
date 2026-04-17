# agent-browser-mcp

Expose the local `agent-browser` CLI as MCP tools and bootstrap Codex integration with one command.

## Quick Start for Codex

1. Install `agent-browser`
2. Run `npx agent-browser-mcp init-codex`
3. Restart Codex

## Release Path

1. Run the test suite with `npm test`.
2. Run TypeScript checks with `npm run typecheck`.
3. Update `CHANGELOG.md` with the release summary.
4. Bump `package.json` version if you are cutting a publishable release.
5. Commit and tag the release after verification passes.

## Verify

Ask Codex to open `https://example.com` and read the page title.
