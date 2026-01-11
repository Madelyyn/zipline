import { prisma } from '@/lib/db';
import { User } from '@/lib/db/models/user';
import { userMiddleware } from '@/server/middleware/user';
import typedPlugin from '@/server/typedPlugin';

export type ApiUserTokenResponse = {
  user?: User;
  token?: string;
};

export const PATH = '/api/user/avatar';
export default typedPlugin(
  async (server) => {
    server.get(PATH, { preHandler: [userMiddleware] }, async (req, res) => {
      const u = await prisma.user.findFirstOrThrow({
        where: {
          id: req.user.id,
        },
        select: {
          avatar: true,
        },
      });

      if (!u.avatar) return res.notFound();

      return res.send(u.avatar);
    });
  },
  { name: PATH },
);
