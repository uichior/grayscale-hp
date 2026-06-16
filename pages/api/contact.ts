import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

/**
 * POST /api/contact — お問い合わせフォームの送信処理
 *
 * Resend でメール送信する。送信先・送信元・APIキーは環境変数で管理:
 *   RESEND_API_KEY   … Resend の API キー（1Password「API Keys」vault → Netlify 環境変数）
 *   CONTACT_TO       … 受信先（未設定時 hoshi@grayscale.jp）
 *   CONTACT_FROM     … 送信元（未設定時 Resend のデフォルト onboarding@resend.dev）
 *
 * 独自ドメイン検証が済んだら CONTACT_FROM を noreply@grayscale.jp 等に切り替える。
 * 問い合わせ者のメールを reply-to に入れるので、星さんはそのまま返信できる。
 */

const TO_EMAIL = process.env.CONTACT_TO || 'hoshi@grayscale.jp'
const FROM_EMAIL = process.env.CONTACT_FROM || 'Grayscale <onboarding@resend.dev>'

interface ContactPayload {
  name?: string
  company?: string
  email?: string
  message?: string
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' })
  }

  const { name = '', company = '', email = '', message = '' } = (req.body || {}) as ContactPayload

  // サーバー側バリデーション（クライアント側と同条件）
  if (!name.trim() || !email.trim() || !isEmail(email) || !message.trim()) {
    return res.status(400).json({ ok: false, error: '入力内容を確認してください' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // キー未設定は構成ミス。ログに残しつつ 500 を返す。
    console.error('[contact] RESEND_API_KEY is not set')
    return res.status(500).json({ ok: false, error: 'メール送信の設定が未完了です' })
  }

  const resend = new Resend(apiKey)
  const safe = {
    name: escapeHtml(name.trim()),
    company: escapeHtml(company.trim() || '（未記入）'),
    email: escapeHtml(email.trim()),
    message: escapeHtml(message.trim()).replace(/\n/g, '<br />'),
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `【お問い合わせ】${name.trim()} 様（${company.trim() || '会社名未記入'}）`,
      text:
        `お名前: ${name.trim()}\n` +
        `会社名: ${company.trim() || '（未記入）'}\n` +
        `メール: ${email.trim()}\n\n` +
        `ご相談内容:\n${message.trim()}\n`,
      html:
        `<div style="font-family:sans-serif;line-height:1.8;color:#0A0A0A">` +
        `<p><strong>お名前:</strong> ${safe.name}</p>` +
        `<p><strong>会社名:</strong> ${safe.company}</p>` +
        `<p><strong>メール:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>` +
        `<hr style="border:none;border-top:1px solid #E5E5E5;margin:16px 0" />` +
        `<p><strong>ご相談内容:</strong></p><p>${safe.message}</p>` +
        `</div>`,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      return res.status(502).json({ ok: false, error: '送信に失敗しました' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] unexpected error:', err)
    return res.status(500).json({ ok: false, error: '送信に失敗しました' })
  }
}
