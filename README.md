# agent-browser-mcp

Expose the local `agent-browser` CLI as MCP tools and bootstrap Codex integration with one command.

## Quick Start for Codex

1. Install `agent-browser`
2. Run `npx agent-browser-mcp init-codex`
3. Restart Codex

## Release Path

1. Run the test suite with `npm test`.
2. Run TypeScript checks with `npm run typecheck`.
3. Update `CHANGELOG.md` with the release summary for the implemented tool surface.
4. Bump `package.json` version if you are cutting a publishable release.
5. Commit and tag the release after verification passes.

## Exposed Tools

This package currently exposes a focused subset of `agent-browser` commands:

- Navigation: `open`, `back`, `forward`, `reload`
- Interaction: `click`, `fill`, `type`
- Read and page state: `get_title`, `get_text`, `get_html`, `snapshot`, `screenshot`, `wait`
- Tabs: `tab_list`, `tab_new`, `tab_close`
- Runtime: `eval`
- Storage and network: `cookies_get`, `network_requests`
- Sessions and passthrough: `session_current`, `session_list`, `session_close`, `run_raw_command`

## Verify

Ask Codex to open `https://example.com` and read the page title.
