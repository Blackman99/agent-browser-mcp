# Agent Browser MCP Design

## Summary

`agent-browser-mcp` is an open-source repository that exposes the local `agent-browser` CLI as a standard MCP server and ships a Codex integration kit so Codex users can install it as a real tool with minimal setup.

The primary user path is `npx`. A user who already has `agent-browser` installed should be able to run one setup command, restart Codex, and immediately get browser tools in a new session.

## Goals

- Expose `agent-browser` as MCP tools that Codex and other MCP hosts can call.
- Cover the full practical surface of the `agent-browser` CLI in the first release.
- Make Codex integration simple enough that a user can complete setup in a few minutes.
- Keep the common path explicit and reliable rather than forcing users through one opaque passthrough command.

## Non-Goals

- Reimplement browser automation independently of `agent-browser`.
- Replace the upstream `agent-browser` CLI.
- Build a hosted remote service.
- Solve every host-specific workflow beyond Codex in the initial release.

## Target Users

- Codex users who want `agent-browser` available as a real tool in sessions.
- Advanced users of other MCP hosts who want a local browser automation server backed by `agent-browser`.
- Contributors who want a thin, maintainable bridge rather than a separate browser automation stack.

## Product Shape

The repository ships two related deliverables:

1. A standard MCP server package that wraps `agent-browser`.
2. A Codex integration kit that creates the local plugin and marketplace files needed for Codex to discover the MCP server as a tool.

The repository should be usable in both ways:

- As a generic MCP server started via `npx agent-browser-mcp`
- As a Codex-focused install flow via `npx agent-browser-mcp init-codex`

## Repository Structure

The repository should be structured as follows:

```text
agent-browser-mcp/
  src/
    cli/
    schema/
    server/
    sessions/
    tools/
  codex/
    plugin/
      .codex-plugin/plugin.json
      .mcp.json
      marketplace.json
  scripts/
  test/
  README.md
  package.json
```

Responsibilities:

- `src/cli`: package entrypoints and user-facing setup commands such as `init-codex`
- `src/schema`: input and output schemas for MCP tools
- `src/server`: MCP server bootstrap, registration, and shared server plumbing
- `src/sessions`: session and tab state management
- `src/tools`: MCP tool handlers that call the underlying `agent-browser` CLI
- `codex/plugin`: template files for Codex local plugin integration
- `test`: unit and integration coverage for the wrapper and install path

## Interface Design

### Primary Tool Strategy

The MCP surface should use explicit tools rather than only exposing a single generic command runner.

Reasons:

- Models choose explicit tools more reliably.
- Input schemas can be validated precisely.
- Error reporting can be specific and structured.
- Documentation and tests become clearer.

### Full Coverage Strategy

The first release should still support the full practical surface of the upstream CLI. To balance usability and coverage, the server should expose two layers:

1. Explicit, named tools for common and high-value actions
2. A low-level passthrough tool for long-tail coverage and forward compatibility

The passthrough tool exists for completeness, but the README and examples should steer users toward the explicit tool set first.

### Tool Grouping

Tools should be grouped by capability area:

- Navigation
  - `open`
  - `back`
  - `forward`
  - `reload`
- Interaction
  - `click`
  - `dblclick`
  - `hover`
  - `focus`
  - `type`
  - `fill`
  - `press`
  - `check`
  - `uncheck`
  - `select`
  - `drag`
  - `upload`
- Page State
  - `wait`
  - `snapshot`
  - `screenshot`
  - `pdf`
  - `scroll`
  - `scroll_into_view`
- Read
  - `get_title`
  - `get_text`
  - `get_html`
  - `get_url`
  - `get_value`
  - `get_attr`
  - `get_count`
  - `get_box`
  - `get_styles`
- Tabs
  - `tab_new`
  - `tab_list`
  - `tab_select`
  - `tab_close`
- Runtime
  - `eval`
  - `console_logs`
  - `page_errors`
  - `highlight`
- Storage and Network
  - `cookies_get`
  - `cookies_set`
  - `cookies_clear`
  - `storage_get`
  - `storage_set`
  - `storage_clear`
  - `network_requests`
  - `network_route`
  - `har_start`
  - `har_stop`
- Sessions
  - `session_current`
  - `session_list`
  - `session_close`
- Advanced
  - `run_raw_command`

The exact set may evolve if the upstream CLI changes, but the wrapper should keep the explicit grouping model stable.

## Session Model

The wrapper must preserve state across tool calls. The MCP server should manage browser context using a named session model.

Rules:

- A default session must exist so simple usage works without setup.
- Every tool may optionally accept a `session` argument.
- Tab tools act on the current active tab unless another tab is specified.
- Tool results should include session context whenever available.

Recommended response metadata:

- `session`
- `tab`
- `url`
- `title`

This avoids stateless behavior where separate calls lose track of the active browser state.

## Error Handling

The wrapper should distinguish between three categories of failure:

1. Schema validation errors
2. Underlying CLI execution failures
3. Wrapper-level state errors such as unknown sessions or invalid tab references

Errors must be returned in structured form rather than as raw text only.

Example shape:

```json
{
  "ok": false,
  "code": "ELEMENT_NOT_FOUND",
  "message": "No element matched selector '#submit'",
  "details": {
    "stderr": "...",
    "exitCode": 1,
    "session": "default"
  }
}
```

This structure allows hosts and users to distinguish invalid input from runtime interaction failures.

## Safety Model

The wrapper should not treat all upstream capabilities as equally safe.

Common navigation and read operations can be part of the default recommended path. Higher-risk capabilities should still be supported, but clearly separated in documentation and tool organization.

Higher-risk categories include:

- `upload`
- `download`
- `clipboard`
- `connect`
- `auth`
- `eval`
- `network route`
- low-level raw command passthrough

These should be grouped as advanced behavior in naming and docs. The first release should preserve full coverage while keeping the safe, common path obvious.

## Codex Integration Design

### Primary User Flow

The main README path for Codex users should be:

1. Install `agent-browser`
2. Run `npx agent-browser-mcp init-codex`
3. Restart Codex

After restart, a new Codex session should discover the plugin and expose the tool set.

### `init-codex` Responsibilities

The `init-codex` command should:

- Verify that `agent-browser` is available on `PATH`
- Create `~/plugins/agent-browser/`
- Write `~/plugins/agent-browser/.codex-plugin/plugin.json`
- Write `~/plugins/agent-browser/.mcp.json`
- Create or update `~/.agents/plugins/marketplace.json`
- Print clear next steps, including restarting Codex

The setup flow should be idempotent and safe to rerun.

### MCP Launch Contract for Codex

The generated `.mcp.json` should launch the server through `npx` so users do not need a global install path:

```json
{
  "mcpServers": {
    "agent-browser": {
      "command": "npx",
      "args": ["-y", "agent-browser-mcp"]
    }
  }
}
```

This keeps the generated plugin resilient across different Node install locations.

## Documentation Strategy

The README should keep one primary path and demote alternatives:

- Primary: Codex installation using `npx` and `init-codex`
- Secondary: manual template-based setup
- Appendix: generic MCP host integration outside Codex

The repository must optimize for the default user path rather than maximizing all possible setup variants on the front page.

## Testing Strategy

The initial implementation plan should include:

- unit tests for schema validation and command argument building
- unit tests for structured error mapping
- unit tests for session and tab state handling
- integration tests for representative explicit tools
- integration tests for passthrough behavior
- tests for `init-codex` filesystem generation and idempotency

If upstream browser binaries are not available in CI, tests should still cover wrapper behavior through isolated command mocking where necessary.

## Release and Packaging

- Repository name: `agent-browser-mcp`
- Publish under a personal GitHub account
- Main runtime entrypoint: `npx agent-browser-mcp`
- License: `MIT`
- The repository should include:
  - `README.md`
  - `CHANGELOG.md`
  - `LICENSE`
  - CI configuration
  - Codex plugin templates

If the bare npm package name is unavailable, the implementation may need a scoped package name, but the design target remains an unscoped package for the simplest user experience.

## Success Criteria

The project is successful when:

- A new user can integrate the wrapper into Codex within roughly five minutes
- A new Codex session can see and call the exposed browser tools
- The documented default flow works without requiring global installation
- The wrapper supports both common explicit tools and full CLI coverage

The minimum demonstration flow should include:

1. Open a page
2. Read the page title
3. Click an element
4. Read text from the page
5. Take a screenshot
6. Close the session

## Risks and Open Constraints

- Upstream `agent-browser` command behavior may evolve over time; the wrapper should isolate command construction so updates stay localized.
- Some advanced CLI behaviors may not map cleanly to short-lived MCP calls unless session state is handled carefully.
- Full surface support increases maintenance cost, so explicit boundaries between stable tools and passthrough behavior are important.
- Codex discovers tools at session start, so generated plugin changes require a restart and a new session to take effect.
