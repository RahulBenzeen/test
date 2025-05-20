import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <div className="text-destructive mb-4">Error: {error}</div>
      <Button onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
};

export default React.memo(ErrorState);