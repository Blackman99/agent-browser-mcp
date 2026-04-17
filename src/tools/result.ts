import { errorEnvelopeSchema, successEnvelopeSchema, type TabMetadata } from '../schema/common.js';
import type { z } from 'zod';

type ExecutionErrorInput = {
  command: string[];
  exitCode: number | null;
  stderr: string;
  session?: string;
};

type SuccessEnvelope<T> = Omit<z.infer<typeof successEnvelopeSchema>, 'data'> & {
  data: T;
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

export function makeSuccess<T>(data: T, session?: string, tab?: TabMetadata): SuccessEnvelope<T> {
  return successEnvelopeSchema.parse({
    ok: true,
    session,
    tab,
    data,
  }) as SuccessEnvelope<T>;
}
