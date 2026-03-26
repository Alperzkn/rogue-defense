import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, CheckCircle, ImagePlus } from 'lucide-react';
import { cn } from '../lib/utils';

const TYPES = ['Feedback', 'Bug Report', 'Feature Request'] as const;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>(TYPES[0]);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setMessage('');
    setContact('');
    setType(TYPES[0]);
    setImage(null);
    setImageName(null);
    setStatus('idle');
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      alert('Image must be under 4MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');
    try {
      const resp = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, contact, image }),
      });
      if (resp.ok) {
        setStatus('sent');
        setTimeout(() => { reset(); setOpen(false); }, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        aria-label="Send feedback"
        onClick={() => { setOpen(true); setStatus('idle'); }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
      >
        <MessageSquare className="h-5 w-5" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { if (status !== 'sending') { setOpen(false); } }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-xl border border-border bg-card p-5"
              onClick={e => e.stopPropagation()}
            >
              {status === 'sent' ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                  <p className="text-sm font-medium text-foreground">Thanks for your feedback!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">Send Feedback</h3>
                    <button
                      type="button"
                      aria-label="Close feedback form"
                      onClick={() => setOpen(false)}
                      className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Type selector */}
                    <div className="flex gap-1.5">
                      {TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                            type === t
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'bg-secondary/50 text-muted-foreground border border-transparent hover:text-foreground'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Message */}
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Describe your feedback, bug, or idea..."
                      rows={4}
                      required
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none resize-none"
                    />

                    {/* Image upload */}
                    <div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        aria-label="Attach screenshot"
                        onChange={handleImage}
                        className="hidden"
                      />
                      {image ? (
                        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                          <img src={image} alt="Preview" className="h-10 w-10 rounded object-cover" />
                          <span className="flex-1 truncate text-xs text-muted-foreground">{imageName}</span>
                          <button
                            type="button"
                            aria-label="Remove image"
                            onClick={() => { setImage(null); setImageName(null); if (fileRef.current) fileRef.current.value = ''; }}
                            className="rounded p-1 text-muted-foreground hover:text-red-400"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                        >
                          <ImagePlus className="h-4 w-4" />
                          Attach screenshot (optional)
                        </button>
                      )}
                    </div>

                    {/* Contact (optional) */}
                    <input
                      type="text"
                      value={contact}
                      onChange={e => setContact(e.target.value)}
                      placeholder="Email or Discord (optional)"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
                    />

                    {status === 'error' && (
                      <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
                    )}

                    <button
                      type="submit"
                      disabled={!message.trim() || status === 'sending'}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      {status === 'sending' ? 'Sending...' : 'Send Feedback'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
