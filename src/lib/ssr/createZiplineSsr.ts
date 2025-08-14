import { ZIPLINE_SSR_PROP } from './constants';

export function createZiplineSsr(data: any) {
  return `<script>window.${ZIPLINE_SSR_PROP} = ${JSON.stringify(data).replace(/</g, '\u003c')};</script>`;
}
