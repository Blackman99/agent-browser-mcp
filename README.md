# agent-browser-mcp

Expose local [`agent-browser`](https://github.com/vercel-labs/agent-browser) capabilities as MCP tools and bootstrap Codex integration quickly.

## Quick Start for Codex

Prerequisite: [`agent-browser`](https://github.com/vercel-labs/agent-browser) must already be installed locally.

1. Run `npx agent-browser-mcp init-codex`
2. Restart Codex or open a new session

## What agent-browser already provides

[`agent-browser`](https://github.com/vercel-labs/agent-browser) already provides a broad browser automation surface, including:

- Navigation and interaction
- Keyboard, mouse, upload, download, and scrolling controls
- Page inspection and info retrieval
- Tabs, sessions, storage, and network operations
- Debugging, diffing, recording, and streaming
- Auth, chat, dashboard, and setup commands

## What this MCP wrapper currently exposes

This package currently exposes a focused subset of [`agent-browser`](https://github.com/vercel-labs/agent-browser) commands:

- Navigation: `open`, `back`, `forward`, `reload`
- Interaction: `click`, `fill`, `type`
- Read and page state: `get_title`, `get_text`, `get_html`, `snapshot`, `screenshot`, `wait`
- Tabs: `tab_list`, `tab_new`, `tab_close`
- Runtime: `eval`
- Storage and network: `cookies_get`, `network_requests`
- Sessions and raw passthrough: `session_current`, `session_list`, `session_close`, `run_raw_command`

## Manual Setup

If you want to wire the plugin in manually, the local Codex templates live under `codex/plugin/`.

## Limitations

- This package currently exposes a subset of the upstream [`agent-browser`](https://github.com/vercel-labs/agent-browser) CLI, not the full surface.
- Some tool families are intentionally narrow right now.
- Broader coverage may be added over time, but the current surface should be treated as evolving.

## Development

For local verification:

- `npm test`
- `npm run typecheck`
