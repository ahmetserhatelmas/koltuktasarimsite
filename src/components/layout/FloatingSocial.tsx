const WA_HREF = "https://wa.me/905438412550";

export function FloatingSocial() {
  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-40 md:bottom-8 md:right-6">
      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/20 transition hover:scale-105 hover:shadow-xl active:scale-95"
        aria-label="WhatsApp ile iletişim"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M20.5 12.3c0 4.5-3.7 8.2-8.2 8.2-1.4 0-2.8-.4-4-1.1L3.5 21l1.7-4.6c-.8-1.3-1.2-2.8-1.2-4.3 0-4.5 3.7-8.2 8.2-8.2s8.3 3.7 8.3 8.2ZM12 4.9a7.3 7.3 0 0 0-6.2 11.1l.2.3-.9 2.6 2.7-.9.3.2a7.3 7.3 0 1 0 3.9-13.3Z" />
        </svg>
      </a>
    </div>
  );
}
