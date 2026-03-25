import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg animate-in slide-in-from-right-full',
              t.type === 'success'
                ? 'border-primary/30 bg-card text-foreground'
                : 'border-destructive/30 bg-card text-destructive',
            )}
          >
            {t.type === 'success' ? <CheckCircle className="h-4 w-4 text-primary" /> : <AlertCircle className="h-4 w-4" />}
            <span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} className="ml-2 text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
