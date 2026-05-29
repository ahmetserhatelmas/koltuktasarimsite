import { CONTACT } from "@/lib/site-data"
import { createClient } from "@/lib/supabase/server"

export async function getContactWhatsApp(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "contact_whatsapp")
      .single()
    return data?.value?.trim() || CONTACT.whatsapp
  } catch {
    return CONTACT.whatsapp
  }
}
