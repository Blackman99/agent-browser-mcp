# README Redesign Design

## Summary

Update the repository README so it is optimized for first-time Codex users who want the fastest path to installing `agent-browser-mcp` and understanding what the package currently exposes.

The new README should stay intentionally short. It should prioritize the Codex bootstrap path, accurately describe the currently implemented subset of tools, and avoid reading like a full documentation site.

## Goals

- Make the first screen of the README enough for a Codex user to install the package.
- Keep the document short and direct.
- Describe the current implemented surface accurately.
- Preserve a short manual-setup path for users who do not want the bootstrap command.
- Keep development instructions minimal and focused on verification.

## Non-Goals

- Build a full reference manual for every tool.
- Add architecture or implementation detail that belongs in deeper docs.
- Document every possible non-Codex MCP host in detail.
- Claim broader upstream `agent-browser` coverage than the repo currently implements.

## Primary Audience

The README should primarily serve Codex users.

Secondary readers include developers who want to inspect the current tool surface or maintain the package locally, but the document should not optimize for them ahead of the Codex install path.

## Information Architecture

The README should use this section order:

1. Title
2. One-sentence repository description
3. `Quick Start for Codex`
4. `What You Get`
5. `Manual Setup`
6. `Limitations`
7. `Development`

This order is intentional. The user should see the install path before any secondary material.

## Section Requirements

### Title and Description

Keep the existing repository title.

Follow it with one short sentence that explains:

- this package exposes local `agent-browser` capabilities as MCP tools
- it can bootstrap Codex integration quickly

This sentence should stay compact and not drift into feature marketing.

### Quick Start for Codex

This section is the README’s primary value.

It should include:

- a short prerequisite note that `agent-browser` must already be installed locally
- the single bootstrap command:
  - `npx agent-browser-mcp init-codex`
- one final step telling the user to restart Codex or open a new session

It should not include unnecessary setup branches or long explanations.

### What You Get

This section should summarize the currently exposed tool subset.

It should clearly state that the package exposes a focused subset of `agent-browser` commands today.

It should group the public surface in plain language using the current implemented families:

- navigation
- interaction
- read and page state
- tabs
- runtime
- storage and network
- sessions and raw passthrough

The wording must remain truthful to the current implementation and must not imply full parity with upstream `agent-browser`.

### Manual Setup

This section should be brief.

It should tell advanced users that repository templates live under `codex/plugin/` and can be used for manual local integration.

It should not expand into a long tutorial unless a later dedicated doc is added.

### Limitations

This section should explicitly state:

- the package currently exposes a subset, not the full upstream CLI
- some tool families are intentionally narrow right now
- users who need broader coverage should treat the current surface as evolving

This section exists to prevent over-promising.

### Development

This section should remain minimal.

It should include only the core verification commands:

- `npm test`
- `npm run typecheck`

If a short one-line lead-in is used, it should stay focused on local verification.

## Writing Style

- Keep the README concise and skimmable.
- Prefer short sections and short bullets.
- Avoid repeating the same promise in multiple sections.
- Avoid architecture explanations unless they are necessary for installation.
- Avoid vague phrases such as “powerful,” “seamless,” or “full-featured.”
- When in doubt, prefer precision over breadth.

## Acceptance Criteria

The redesign is successful when:

- a Codex user can identify the install command within a few seconds
- the README does not overstate the currently implemented tool coverage
- the manual path is still discoverable
- the development section is shorter than the installation section
- the resulting README remains substantially shorter than a full documentation page
