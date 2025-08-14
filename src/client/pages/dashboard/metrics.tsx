import DashboardMetrics from '@/components/pages/metrics';
import { useTitle } from '@/lib/hooks/useTitle';

export function Component() {
  useTitle('Metrics');

  return <DashboardMetrics />;
}

Component.displayName = 'Dashboard/Metrics';
