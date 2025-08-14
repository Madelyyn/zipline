import DashboardFolders from '@/components/pages/folders';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('Folders');

  return <DashboardFolders />;
}

Component.displayName = 'Dashboard/Folders';
