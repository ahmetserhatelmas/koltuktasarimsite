export function FloatingSocial() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-between px-4 md:bottom-8 md:px-6">
      <a
        href="#"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-600/20 transition hover:scale-105 hover:shadow-xl active:scale-95"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M20.5 12.3c0 4.5-3.7 8.2-8.2 8.2-1.4 0-2.8-.4-4-1.1L3.5 21l1.7-4.6c-.8-1.3-1.2-2.8-1.2-4.3 0-4.5 3.7-8.2 8.2-8.2s8.3 3.7 8.3 8.2ZM12 4.9a7.3 7.3 0 0 0-6.2 11.1l.2.3-.9 2.6 2.7-.9.3.2a7.3 7.3 0 1 0 3.9-13.3Z" />
        </svg>
      </a>
      <a
        href="#"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95"
        aria-label="Instagram"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5Zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5ZM17.5 6.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
        </svg>
      </a>
    </div>
  );
}
