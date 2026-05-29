import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, subject, message } = body

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 })
    }

    const toEmail = process.env.CONTACT_TO_EMAIL
    if (!toEmail) {
      return NextResponse.json({ error: "Alıcı e-posta adresi yapılandırılmamış." }, { status: 500 })
    }

    const { error } = await resend.emails.send({
      from: "Koltuk Dünyası İletişim <iletisim@koltukdunyam.com>",
      to: [toEmail],
      replyTo: email,
      subject: subject ? `[İletişim] ${subject}` : `[İletişim] ${name} mesaj gönderdi`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#111;margin-bottom:20px;border-bottom:2px solid #e5e5e5;padding-bottom:12px;">
            Yeni İletişim Formu Mesajı
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e5e5e5;font-weight:bold;width:140px;color:#555;">Ad Soyad</td>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e5e5e5;color:#111;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#f5f5f5;border:1px solid #e5e5e5;font-weight:bold;color:#555;">Telefon</td>
              <td style="padding:10px 12px;background:#f5f5f5;border:1px solid #e5e5e5;color:#111;">${phone}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e5e5e5;font-weight:bold;color:#555;">E-posta</td>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e5e5e5;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding:10px 12px;background:#f5f5f5;border:1px solid #e5e5e5;font-weight:bold;color:#555;">Konu</td>
              <td style="padding:10px 12px;background:#f5f5f5;border:1px solid #e5e5e5;color:#111;">${subject}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e5e5e5;font-weight:bold;color:#555;vertical-align:top;">Mesaj</td>
              <td style="padding:10px 12px;background:#fff;border:1px solid #e5e5e5;color:#111;white-space:pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="margin-top:20px;font-size:12px;color:#999;">
            Bu mesaj koltukdunyasi.com iletişim formundan gönderildi.
            Yanıtlamak için doğrudan bu e-postayı yanıtlayabilirsiniz.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 })
  }
}
