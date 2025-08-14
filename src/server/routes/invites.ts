import fastifyPlugin from 'fastify-plugin';

export const PATH = '/invite/:id';
export default fastifyPlugin(
  (server, _, done) => {
    server.get<{ Params: { id: string } }>(PATH, async (req, res) => {
      const { id } = req.params;
      if (!id) return res.callNotFound();

      return res.redirect(`/auth/register?code=${encodeURIComponent(id)}`);
    });

    done();
  },
  { name: PATH },
);
