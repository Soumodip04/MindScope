import { Metadata } from 'next';
import CrisisPreventionDashboard from '@/components/CrisisPreventionDashboard';

export const metadata: Metadata = {
  title: 'Crisis Prevention - MindScope',
  description: 'Advanced crisis prevention system with 24/7 monitoring and emergency intervention protocols',
};

export default function CrisisPreventionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <CrisisPreventionDashboard />
    </div>
  );
}
