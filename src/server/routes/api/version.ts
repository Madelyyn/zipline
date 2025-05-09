import { userMiddleware } from '@/server/middleware/user';
import fastifyPlugin from 'fastify-plugin';
import { getVersion } from '@/lib/version';

export type ApiVersionResponse = {
  details: ReturnType<typeof getVersion>;
  data: VersionAPI;
};

interface VersionAPI {
  isUpstream: boolean;
  isRelease: boolean;
  isLatest: boolean;
  version: {
    tag: string;
    sha: string;
    url: string;
  };
  latest: {
    tag: string;
    url: string;
    commit?: {
      sha: string;
      url: string;
      pull: boolean;
    };
  };
}

export const PATH = '/api/version';
export default fastifyPlugin(
  (server, _, done) => {
    server.get(PATH, { preHandler: [userMiddleware] }, async (_, res) => {
      const details = getVersion();
      const params = new URLSearchParams([['details', JSON.stringify(details)]]);

      const resp = await fetch(`https://zipline-version.diced.sh/?${params.toString()}`);

      if (!resp.ok) {
        return res.internalServerError('failed to fetch version details: ' + (await resp.text()));
      }

      const data: VersionAPI = await resp.json();

      return res.send({
        data,
        details,
      });
    });

    done();
  },
  { name: PATH },
);
