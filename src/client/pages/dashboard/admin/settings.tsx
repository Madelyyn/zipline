import DashboardServerSettings from '@/components/pages/serverSettings';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('Server Settings');

  return <DashboardServerSettings />;
}

Component.displayName = 'Dashboard/Admin/Settings';
