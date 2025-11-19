import { Export4, validateExport } from '@/lib/import/version4/validateExport';
import { log } from '@/lib/logger';
import { secondlyRatelimit } from '@/lib/ratelimits';
import { administratorMiddleware } from '@/server/middleware/administrator';
import { userMiddleware } from '@/server/middleware/user';
import fastifyPlugin from 'fastify-plugin';

export type ApiServerImportV4 = {
  users: Record<string, string>;
  files: Record<string, string>;
  folders: Record<string, string>;
  urls: Record<string, string>;
  settings: string[];
};

type Body = {
  export4: Export4;

  importFromUser?: string;
};

const logger = log('api').c('server').c('import').c('v4');

export const PATH = '/api/server/import/v4';
export default fastifyPlugin(
  (server, _, done) => {
    server.post<{ Body: Body }>(
      PATH,
      {
        preHandler: [userMiddleware, administratorMiddleware],
        // 24gb, just in case
        bodyLimit: 24 * 1024 * 1024 * 1024,
        ...secondlyRatelimit(5),
      },
      async (req, res) => {
        if (req.user.role !== 'SUPERADMIN') return res.forbidden('not super admin');

        const { export4 } = req.body;
        if (!export4) return res.badRequest('missing export4 in request body');

        const validated = validateExport(export4);
        if (!validated.success) {
          logger.error('Failed to validate import data', { error: validated.error });

          return res.status(400).send({
            error: 'Failed to validate import data',
            statusCode: 400,
            details: validated.error.issues,
          });
        }

        return res.send({ message: 'Import v4 is not yet implemented' });
      },
    );

    done();
  },
  { name: PATH },
);
