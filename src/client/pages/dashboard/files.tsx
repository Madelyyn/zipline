import DashboardFiles from '@/components/pages/files';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('Files');

  return <DashboardFiles />;
}

Component.displayName = 'Dashboard/Files';
