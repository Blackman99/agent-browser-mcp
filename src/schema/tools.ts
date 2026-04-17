import { z } from 'zod';

export const sessionArgSchema = z.object({
  session: z.string().default('default'),
});

export const openArgsSchema = sessionArgSchema.extend({
  url: z.string().url(),
});

export const rawArgsSchema = sessionArgSchema.extend({
  args: z.array(z.string()).min(1),
});
