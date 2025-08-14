import DashboardHome from '@/components/pages/dashboard';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle();

  return <DashboardHome />;
}

Component.displayName = 'Dashboard/';
