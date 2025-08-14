import UploadFile from '@/components/pages/upload/File';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('Upload File');

  return <UploadFile />;
}

Component.displayName = 'Dashboard/Upload/File';
