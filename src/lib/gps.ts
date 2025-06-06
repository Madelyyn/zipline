import ExifTransformer from 'exif-be-gone';
import { PassThrough } from 'stream';

export async function removeGps(buffer: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const input = new PassThrough();
    input.end(buffer);

    const transformer = new ExifTransformer();

    const chunks: Buffer[] = [];
    transformer.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    transformer.once('error', (err: Error) => {
      reject(err);
    });

    transformer.once('end', () => {
      const stripped = Buffer.concat(chunks);
      resolve(stripped);
    });

    input.pipe(transformer);
  });
}
