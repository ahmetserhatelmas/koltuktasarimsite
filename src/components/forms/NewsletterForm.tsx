"use client";

export function NewsletterForm() {
  return (
    <form
      className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="E-posta adresiniz"
        className="h-11 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-300 focus:ring-4 lg:max-w-xs"
      />
      <button
        type="submit"
        className="h-11 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.99]"
      >
        Kaydol
      </button>
    </form>
  );
}
