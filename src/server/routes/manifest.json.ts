import { config } from '@/lib/config';
import fastifyPlugin from 'fastify-plugin';

function generateIcons(sizes: number[]) {
  return sizes.map((size) => ({
    src: `/favicon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
  }));
}

export const PATH = '/manifest.json';
export default fastifyPlugin(
  (server, _, done) => {
    server.get(PATH, async (req, res) => {
      if (!config.pwa.enabled) return res.callNotFound();

      return {
        name: config.pwa.title,
        short_name: config.pwa.shortName,
        description: config.pwa.description,
        theme_color: config.pwa.themeColor,
        background_color: config.pwa.backgroundColor,

        start_url: '/',
        display: 'standalone',
        icons: generateIcons([16, 32, 64, 128, 512]),
      };
    });

    done();
  },
  { name: PATH },
);
