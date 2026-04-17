export function renderPluginJson() {
  return {
    name: 'agent-browser',
    version: '0.1.0',
    description: 'Expose agent-browser as Codex MCP tools.',
    author: {
      name: 'zhaodongsheng',
      email: 'opensource@example.com',
      url: 'https://github.com/zhaodongsheng',
    },
    homepage: 'https://github.com/zhaodongsheng/agent-browser-mcp',
    license: 'MIT',
    mcpServers: './.mcp.json',
    interface: {
      displayName: 'Agent Browser',
      shortDescription: 'Browser automation via agent-browser CLI',
      longDescription: 'Wraps the local agent-browser CLI as MCP tools for Codex.',
      developerName: 'zhaodongsheng',
      category: 'Productivity',
      capabilities: ['Interactive', 'Write'],
      websiteURL: 'https://github.com/zhaodongsheng/agent-browser-mcp',
      privacyPolicyURL: 'https://github.com/zhaodongsheng/agent-browser-mcp',
      termsOfServiceURL: 'https://github.com/zhaodongsheng/agent-browser-mcp',
      defaultPrompt: [
        'Open a page and read its title',
        'Inspect a page and extract text',
        'Take a screenshot of the current page',
      ],
      brandColor: '#2563EB',
      screenshots: [],
    },
  };
}

export function renderMcpJson() {
  return {
    mcpServers: {
      'agent-browser': {
        command: 'npx',
        args: ['-y', 'agent-browser-mcp'],
      },
    },
  };
}

export function renderMarketplaceJson() {
  return {
    name: 'local',
    interface: {
      displayName: 'Local Plugins',
    },
    plugins: [
      {
        name: 'agent-browser',
        source: {
          source: 'local',
          path: './plugins/agent-browser',
        },
        policy: {
          installation: 'INSTALLED_BY_DEFAULT',
          authentication: 'ON_USE',
        },
        category: 'Productivity',
      },
    ],
  };
}
