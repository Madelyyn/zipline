import { useUserStore } from '@/lib/client/store/user';
import type { File as DbFile } from '@/lib/db/models/file';
import { useEffect, useMemo } from 'react';

export function appendPassword(url: string, password?: string | null) {
  return `${url}${password ? `?pw=${encodeURIComponent(password)}` : ''}`;
}

export function isDbFile(file: DbFile | File): file is DbFile {
  return typeof globalThis.File !== 'undefined' ? !(file instanceof globalThis.File) : 'thumbnail' in file;
}

export default function useFileUrls({ file, password }: { file: DbFile | File; password?: string | null }): {
  fileUrl: string;
  thumbnailUrl: string | null;
  viewUrl: string | null;
} {
  const user = useUserStore((state) => state.user);

  const blobUrl = useMemo(() => (isDbFile(file) ? null : URL.createObjectURL(file as File)), [file]);

  useEffect(() => {
    if (!blobUrl) return;

    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return useMemo(() => {
    if (!isDbFile(file)) {
      return { fileUrl: blobUrl ?? '', thumbnailUrl: null, viewUrl: null };
    }

    const thumb = file.thumbnail?.path;
    const thumbnailUrl = thumb ? (user ? `/api/user/files/${thumb}/raw` : `/raw/${thumb}`) : null;

    return {
      fileUrl: appendPassword(user ? `/api/user/files/${file.id}/raw` : `/raw/${file.name}`, password),
      viewUrl: appendPassword(`/view/${file.name}`, password),
      thumbnailUrl,
    };
  }, [blobUrl, file, password, user]);
}
