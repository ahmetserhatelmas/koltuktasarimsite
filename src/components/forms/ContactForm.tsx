"use client";

export function ContactForm() {
  return (
    <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
      {[
        ["Adınız soyadınız", "text", true],
        ["Telefon numaranız", "tel", true],
        ["E-posta adresiniz", "email", true],
        ["Konu", "text", false],
      ].map(([label, type, req]) => (
        <label key={label as string} className="block text-sm text-zinc-700">
          <span className="font-medium">
            {label}
            {req ? " *" : ""}
          </span>
          <input
            type={type as string}
            required={req as boolean}
            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10"
          />
        </label>
      ))}
      <label className="block text-sm text-zinc-700">
        <span className="font-medium">Mesajınız *</span>
        <textarea
          required
          rows={5}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input type="checkbox" required className="h-4 w-4 rounded border-zinc-300" />
        Robot olmadığımı onaylıyorum (demo)
      </label>
      <button
        type="submit"
        className="h-11 rounded-full border border-zinc-900 bg-white px-8 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
      >
        Gönder
      </button>
    </form>
  );
}
