'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Get started by creating your first task. Stay organized and track your progress!
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
