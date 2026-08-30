interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.formData();
    const token = formData.get('cf-turnstile-response')?.toString();
    const honeypot = formData.get('bot-field')?.toString();

    // 1. Basic Abuse Prevention (Honeypot)
    if (honeypot) {
      return new Response(JSON.stringify({ error: 'Invalid submission' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Turnstile Verification
    if (!token) {
      return new Response(JSON.stringify({ error: 'Turnstile token missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ip = context.request.headers.get('CF-Connecting-IP') || '';
    const turnstileUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    
    const turnstileFormData = new FormData();
    turnstileFormData.append('secret', context.env.TURNSTILE_SECRET_KEY);
    turnstileFormData.append('response', token);
    turnstileFormData.append('remoteip', ip);

    const result = await fetch(turnstileUrl, {
      body: turnstileFormData,
      method: 'POST',
    });

    const outcome = await result.json() as any;

    if (!outcome.success) {
      return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Extract and Validate Input
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const message = formData.get('message')?.toString().trim();
    const consent = formData.get('consent')?.toString() === 'true' ? 1 : 0;
    
    // Optional Tracking fields
    const source_path = formData.get('source_path')?.toString();
    const utm_source = formData.get('utm_source')?.toString();

    if (!name || !email || !phone || consent === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields or consent' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (name.length > 200 || (email && email.length > 200) || (message && message.length > 2000)) {
      return new Response(JSON.stringify({ error: 'Input too long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Save to D1 Database using parameterized queries
    const id = crypto.randomUUID();
    
    const stmt = context.env.DB.prepare(
      `INSERT INTO enquiries (
        id, name, email, phone, message, consent, source_path, utm_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, name, email || null, phone || null, message || null, consent, source_path || null, utm_source || null
    );

    await stmt.run();

    return new Response(JSON.stringify({ success: true, message: 'Enquiry received.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Enquiry error:', err.message);
    // Do not leak database errors or secret values to the client
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
