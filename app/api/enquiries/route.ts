import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { sanityConfig } from '@/lib/sanity/config'

const writeClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    // Basic Honeypot to catch bots
    const honeypot = formData.get('bot-field')?.toString()
    if (honeypot) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    const name = formData.get('name')?.toString().trim()
    const email = formData.get('email')?.toString().trim()
    const phone = formData.get('phone')?.toString().trim()
    const message = formData.get('message')?.toString().trim()
    const destination = formData.get('destination')?.toString()
    const educationLevel = formData.get('educationLevel')?.toString()
    const intake = formData.get('intake')?.toString()
    const academicBackground = formData.get('academicBackground')?.toString()
    const tests = formData.getAll('tests').map(t => t.toString()) // Tests could be passed differently depending on form, let's extract properly
    const consent = formData.get('consent')?.toString() === 'true'
    const sourcePath = formData.get('source_path')?.toString()
    const utmSource = formData.get('utm_source')?.toString()

    if (!name || !email || !phone || !consent) {
      return NextResponse.json({ error: 'Missing required fields or consent' }, { status: 400 })
    }

    // 1. Save to Sanity
    try {
      await writeClient.create({
        _type: 'enquiry',
        name,
        email,
        phone,
        message,
        destination,
        educationLevel,
        intake,
        academicBackground,
        sourcePath,
        utmSource,
        submittedAt: new Date().toISOString(),
      })
    } catch (sanityError) {
      console.error('Failed to save to Sanity:', sanityError)
      // We log but don't fail the request completely if email still works
    }

    // 2. Send Email via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const emailHtml = `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Destination:</strong> ${destination || 'Not specified'}</p>
        <p><strong>Education Level:</strong> ${educationLevel || 'Not specified'}</p>
        <p><strong>Intake:</strong> ${intake || 'Not specified'}</p>
        <p><strong>Academic Background:</strong> ${academicBackground || 'Not specified'}</p>
        <br />
        <p><strong>Message:</strong></p>
        <p>${message?.replace(/\n/g, '<br />') || 'No message provided'}</p>
        <br />
        <p><small>Submitted from: ${sourcePath} ${utmSource ? `(Source: ${utmSource})` : ''}</small></p>
      `

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Top Consultancy Nepal <onboarding@resend.dev>',
          to: 'goretotrekmetechnical@gmail.com',
          subject: `New Enquiry from ${name}`,
          html: emailHtml,
          reply_to: email
        })
      })
      if (!resendRes.ok) {
        const err = await resendRes.text()
        console.error('Resend API Error:', err)
      }
    }

    return NextResponse.json({ success: true, message: 'Enquiry received.' })
  } catch (error) {
    console.error('Enquiry error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
