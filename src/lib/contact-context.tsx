"use client"

import { createContext, useContext } from "react"
import { CONTACT } from "@/lib/site-data"

const ContactContext = createContext<{ whatsapp: string }>({ whatsapp: CONTACT.whatsapp })

export function ContactProvider({
  whatsapp,
  children,
}: {
  whatsapp: string
  children: React.ReactNode
}) {
  return (
    <ContactContext.Provider value={{ whatsapp: whatsapp.trim() || CONTACT.whatsapp }}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContact() {
  return useContext(ContactContext)
}
