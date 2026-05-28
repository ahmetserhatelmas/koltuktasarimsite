import type { Metadata } from "next"
import { AdminSidebar } from "./_components/AdminSidebar"

export const metadata: Metadata = {
  title: "Admin Paneli | Koltuk Dünyası",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6 sm:p-8">{children}</div>
      </main>
    </div>
  )
}
