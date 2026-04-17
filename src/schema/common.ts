import { z } from 'zod';

export const tabMetadataSchema = z.object({
  id: z.number(),
  url: z.string().optional(),
  title: z.string().optional(),
  active: z.boolean().default(true),
});

export const successEnvelopeSchema = z.object({
  ok: z.literal(true),
  session: z.string().optional(),
  tab: tabMetadataSchema.optional(),
  data: z.unknown().optional(),
});

export const errorEnvelopeSchema = z.object({
  ok: z.literal(false),
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).default({}),
});

export type TabMetadata = z.infer<typeof tabMetadataSchema>;
