import { execa } from 'execa';

export type ExecutionResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  session: string;
  tab?: {
    id: number;
    url?: string;
    title?: string;
    active: boolean;
  };
};

export type RunAgentBrowser = (args: string[], session?: string) => Promise<ExecutionResult>;

export function createAgentBrowserRunner(binary = 'agent-browser'): RunAgentBrowser {
  return async (args, session = 'default') => {
    const finalArgs = ['session', session, ...args];
    const result = await execa(binary, finalArgs, { reject: false });

    if (result.exitCode !== 0) {
      throw {
        command: [binary, ...finalArgs],
        exitCode: result.exitCode,
        stderr: result.stderr,
        session,
      };
    }

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode ?? 0,
      session,
    };
  };
}
