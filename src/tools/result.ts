import { errorEnvelopeSchema, successEnvelopeSchema, type TabMetadata } from '../schema/common.js';

type ExecutionErrorInput = {
  command: string[];
  exitCode: number | null;
  stderr: string;
  session?: string;
};

export function mapExecutionError(input: ExecutionErrorInput) {
  return errorEnvelopeSchema.parse({
    ok: false,
    code: 'CLI_EXECUTION_FAILED',
    message: input.stderr || `Command failed: ${input.command.join(' ')}`,
    details: {
      command: input.command,
      exitCode: input.exitCode,
      stderr: input.stderr,
      session: input.session,
    },
  });
}

export function makeSuccess<T>(data: T, session?: string, tab?: TabMetadata) {
  return successEnvelopeSchema.parse({
    ok: true,
    session,
    tab,
    data,
  });
}
