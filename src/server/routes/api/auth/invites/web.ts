import { config } from '@/lib/config';
import { prisma } from '@/lib/db';
import { Invite } from '@/lib/db/models/invite';
import { log } from '@/lib/logger';
import { secondlyRatelimit } from '@/lib/ratelimits';
import { administratorMiddleware } from '@/server/middleware/administrator';
import { userMiddleware } from '@/server/middleware/user';
import fastifyPlugin from 'fastify-plugin';

export type ApiAuthInvitesResponse = Invite | Invite[];

type Query = {
  code: string;
};

const logger = log('api').c('auth').c('invites').c('web');

export const PATH = '/api/auth/invites/web';
export default fastifyPlugin(
  (server, _, done) => {
    server.get<{ Querystring: Query }>(
      PATH,
      { preHandler: [userMiddleware, administratorMiddleware], ...secondlyRatelimit(10) },
      async (req, res) => {
        const { code } = req.query;

        if (!code) return res.send({ invite: null });
        if (!config.invites.enabled) return res.notFound();

        const invite = await prisma.invite.findFirst({
          where: {
            OR: [{ id: code }, { code }],
          },
          select: {
            code: true,
            maxUses: true,
            uses: true,
            expiresAt: true,
            inviter: {
              select: { username: true },
            },
          },
        });

        if (
          !invite ||
          (invite.expiresAt && new Date(invite.expiresAt) < new Date()) ||
          (invite.maxUses && invite.uses >= invite.maxUses)
        ) {
          return res.notFound();
        }

        delete (invite as any).expiresAt;

        return res.send({ invite });
      },
    );

    done();
  },
  { name: PATH },
);
