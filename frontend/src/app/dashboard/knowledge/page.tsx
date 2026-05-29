import { Card } from '@/components/ui/Card';
import { BookOpen, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function KnowledgePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Knowledge Base</h2>
          <p className="text-slate-400 text-sm mt-1">Upload FAQs and documents to train your chatbot</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="gap-2"><Upload size={14} /> Upload PDF</Button>
          <Button size="sm" className="gap-2"><Plus size={14} /> Add FAQ</Button>
        </div>
      </div>

      {/* Empty state */}
      <Card className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
          <BookOpen className="w-8 h-8 text-brand-400" />
        </div>
        <h3 className="font-display text-lg font-semibold text-white mb-2">No documents yet</h3>
        <p className="text-slate-400 text-sm max-w-xs mb-6">
          Add FAQs or upload PDFs to start training your chatbot on your business knowledge.
        </p>
        <Badge label="AI Indexing Ready" variant="emerald" />
      </Card>
    </div>
  );
}
