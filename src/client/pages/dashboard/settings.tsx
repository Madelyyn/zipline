import DashboardSettings from '@/components/pages/settings';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('Settings');

  return <DashboardSettings />;
}

Component.displayName = 'Dashboard/Settings';
