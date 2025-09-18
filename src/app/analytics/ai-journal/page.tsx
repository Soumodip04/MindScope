import { Metadata } from 'next';
import AITherapyJournal from '@/components/AITherapyJournal';

export const metadata: Metadata = {
  title: 'AI Therapy Journal - MindScope',
  description: 'Intelligent journaling platform with AI-powered insights for therapeutic growth and self-discovery',
};

export default function AITherapyJournalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <AITherapyJournal />
    </div>
  );
}
