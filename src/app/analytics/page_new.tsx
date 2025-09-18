import { Metadata } from 'next';
import AnalyticsDashboardHub from '@/components/AnalyticsDashboardHub';

export const metadata: Metadata = {
  title: 'Analytics Hub - MindScope',
  description: 'Comprehensive mental health analytics hub with AI intelligence, biometric monitoring, and therapeutic insights',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnalyticsDashboardHub />
    </div>
  );
}
