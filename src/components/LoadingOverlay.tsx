import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Đang tải...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#086644]" />
        <p className="text-[#086644] font-medium text-lg">{message}</p>
      </div>
    </div>
  );
}
