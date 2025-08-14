import { config } from '@/lib/config';
import fastifyPlugin from 'fastify-plugin';

export const PATH = '/robots.txt';
export default fastifyPlugin(
  (server, _, done) => {
    server.get(PATH, async (req, res) => {
      if (!config.features.robotsTxt) return res.callNotFound();

      return 'User-Agent: *\nDisallow: /';
    });

    done();
  },
  { name: PATH },
);
