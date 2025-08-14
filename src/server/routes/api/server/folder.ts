import { prisma } from '@/lib/db';
import { fileSelect } from '@/lib/db/models/file';
import { cleanFolder, Folder } from '@/lib/db/models/folder';
import fastifyPlugin from 'fastify-plugin';

export type ApiServerFolderResponse = Partial<Folder>;

type Params = {
  id: string;
};

type Query = {
  uploads?: boolean;
};

export const PATH = '/api/server/folder/:id';
export default fastifyPlugin(
  (server, _, done) => {
    server.get<{ Params: Params; Querystring: Query }>(PATH, async (req, res) => {
      const { id } = req.params;
      const { uploads } = req.query;

      const folder = await prisma.folder.findUnique({
        where: {
          id: id,
        },
        include: {
          files: {
            select: {
              ...fileSelect,
              password: true,
              tags: false,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!folder) return res.notFound();

      if ((uploads && !folder.allowUploads) || (!uploads && !folder.public)) return res.notFound();

      return res.send(cleanFolder(folder, true));
    });

    done();
  },
  { name: PATH },
);
