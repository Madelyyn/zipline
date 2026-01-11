import z from 'zod';
import { sanitizeFilename } from './fs';

export function zValidatePath(val: string | undefined, ctx: z.RefinementCtx) {
  if (!val) return;

  const sanitized = sanitizeFilename(val);
  if (!sanitized) {
    ctx.addIssue({
      code: 'custom',
      message: 'Invalid path',
      input: val,
    });

    return undefined;
  }

  return sanitized;
}
