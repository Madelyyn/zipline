import DashboardUsers from '@/components/pages/users';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('Users');

  return <DashboardUsers />;
}

Component.displayName = 'Dashboard/Admin/Users';
