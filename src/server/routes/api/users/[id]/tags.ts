import { prisma } from '@/lib/db';
import { Tag, tagSelect } from '@/lib/db/models/tag';
import { canInteract } from '@/lib/role';
import { administratorMiddleware } from '@/server/middleware/administrator';
import { userMiddleware } from '@/server/middleware/user';
import fastifyPlugin from 'fastify-plugin';

export type ApiUsersIdTagsResponse = Tag[];

type Params = {
  id: string;
};

// const logger = log('api').c('user').c('id').c('tags');

export const PATH = '/api/users/:id/tags';
export default fastifyPlugin(
  (server, _, done) => {
    server.get<{ Params: Params }>(
      PATH,
      { preHandler: [userMiddleware, administratorMiddleware] },
      async (req, res) => {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
          where: {
            id,
          },
        });

        if (!user) return res.notFound();
        if (!canInteract(req.user.role, user.role)) return res.notFound();

        const tags = await prisma.tag.findMany({
          where: {
            userId: user.id,
          },
          select: tagSelect,
        });

        return res.send(tags);
      },
    );

    done();
  },
  { name: PATH },
);
