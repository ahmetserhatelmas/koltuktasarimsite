"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"

type FormState = "idle" | "sending" | "success" | "error"

export function ContactForm() {
  const { t } = useI18n()
  const c = t.contact
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("sending")
    setErrorMsg("")

    const fd = new FormData(e.currentTarget)
    const payload = {
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? "Bir hata oluştu.")
        setState("error")
      } else {
        setState("success")
      }
    } catch {
      setErrorMsg("Bağlantı hatası. Lütfen tekrar deneyin.")
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-6 py-10 text-center">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="text-base font-semibold text-green-800">{c.success_title}</p>
          <p className="mt-1 text-sm text-green-700">{c.success_sub}</p>
        </div>
        <button
          onClick={() => setState("idle")}
          className="mt-2 text-xs font-medium text-green-700 underline underline-offset-2 hover:text-green-900"
        >
          {c.new_message}
        </button>
      </div>
    )
  }

  const sending = state === "sending"

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm text-zinc-700">
        <span className="font-medium">{c.name} *</span>
        <input
          name="name"
          type="text"
          required
          disabled={sending}
          className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10 disabled:opacity-60"
        />
      </label>

      <label className="block text-sm text-zinc-700">
        <span className="font-medium">{c.phone_field} *</span>
        <input
          name="phone"
          type="tel"
          required
          disabled={sending}
          className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10 disabled:opacity-60"
        />
      </label>

      <label className="block text-sm text-zinc-700">
        <span className="font-medium">{c.email_field} *</span>
        <input
          name="email"
          type="email"
          required
          disabled={sending}
          className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10 disabled:opacity-60"
        />
      </label>

      <label className="block text-sm text-zinc-700">
        <span className="font-medium">{c.subject}</span>
        <input
          name="subject"
          type="text"
          disabled={sending}
          className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10 disabled:opacity-60"
        />
      </label>

      <label className="block text-sm text-zinc-700">
        <span className="font-medium">{c.message} *</span>
        <textarea
          name="message"
          required
          rows={5}
          disabled={sending}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10 disabled:opacity-60"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input type="checkbox" required className="h-4 w-4 rounded border-zinc-300" />
        {c.robot}
      </label>

      {state === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg || "Bir hata oluştu. Lütfen tekrar deneyin."}
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="h-11 rounded-full border border-zinc-900 bg-white px-8 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white disabled:opacity-60"
      >
        {sending ? c.sending : c.send}
      </button>
    </form>
  )
}
