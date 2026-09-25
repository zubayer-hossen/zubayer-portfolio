import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useLockBody } from '../../hooks';
import { cn } from '../../lib/utils';

export default function Lightbox({ images, index, onClose, onChange }) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  useLockBody(true);

  const go = useCallback(
    (d) => {
      setZoom(false);
      onChange((index + d + images.length) % images.length);
    },
    [index, images.length, onChange]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  const onMove = (e) => {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const iconBtn = 'grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20';
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-[120] flex flex-col bg-black/95">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm text-white/70">{index + 1} / {images.length}</span>
        <div className="flex gap-2">
          <button type="button" className={iconBtn} onClick={() => setZoom((z) => !z)} aria-label={zoom ? 'Zoom out' : 'Zoom in'}>
            {zoom ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>
          <button type="button" className={iconBtn} onClick={onClose} aria-label="Close viewer"><X className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="relative grid flex-1 place-items-center overflow-hidden" onMouseMove={onMove}>
        <img
          src={images[index]}
          alt={`Screenshot ${index + 1}`}
          onClick={() => setZoom((z) => !z)}
          style={{ transformOrigin: origin, transform: zoom ? 'scale(2.2)' : 'scale(1)', transition: 'transform .25s ease' }}
          className={cn('max-h-full max-w-full object-contain', zoom ? 'cursor-zoom-out' : 'cursor-zoom-in')}
        />
        {images.length > 1 && (
          <>
            <button type="button" className={cn(iconBtn, 'absolute left-3 top-1/2 -translate-y-1/2')} onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" className={cn(iconBtn, 'absolute right-3 top-1/2 -translate-y-1/2')} onClick={() => go(1)} aria-label="Next image"><ChevronRight className="h-5 w-5" /></button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
