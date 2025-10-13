# SendGrid setup and local testing

This project includes a serverless endpoint at `api/send-email.ts` which forwards contact form submissions to SendGrid's mail send API.

Steps to set up SendGrid and test the endpoint
ye
1. Create a SendGrid account
   - Sign up at https://sendgrid.com and verify your account.

2. Create an API key
   - In the SendGrid dashboard, go to Settings → API Keys → Create API Key.
   - Give it a name like "Website Contact Form" and grant "Full Access" or at minimum "Mail Send" permission.
   - Copy the API key and keep it safe.

3. Verify a sender identity or authenticate your domain
   - For FROM_EMAIL to work reliably, either verify a single sender identity (Settings → Sender Authentication → Single Sender Verification) or authenticate your domain.
   - Use the exact address you plan to set in `FROM_EMAIL`, or authenticate your sending domain so arbitrary FROM addresses at that domain are allowed.

4. Configure environment variables
   - Locally: create a `.env` file in the project root and add the variables from the repository `.env.example`:

     SENDGRID_API_KEY=your_sendgrid_api_key_here
     TO_EMAIL=you@example.com
     FROM_EMAIL=no-reply@yourdomain.com

   - On Vercel: go to your project Settings → Environment Variables and add the same keys (set to Production where appropriate).

5. Test locally (recommended)
   - This repo likely runs with Vite and Vercel serverless functions. To test the serverless endpoint locally you can:
     - Use Vercel CLI to run serverless functions locally: `vercel dev` (recommended).
     - Or run a small node script that POSTs to the endpoint while your dev server is running and able to handle api routes.

   - Example curl to test the endpoint once the dev server is running at http://localhost:3000:

     curl -X POST http://localhost:3000/api/send-email \
       -H "Content-Type: application/json" \
       -d '{"name":"Test User","email":"test@example.com","message":"Hello from local test"}'

   - Expected result: HTTP 200 with JSON { ok: true } if SendGrid accepted the message. If SendGrid rejects it, the endpoint returns an error and includes SendGrid's response body.

6. Test on Vercel (production)
   - Deploy the project to Vercel and make sure the environment variables are set in the Vercel dashboard.
   - Submit the contact form from the site or POST an equivalent request to `https://your-deployment-url.vercel.app/api/send-email`.

Security and operational notes
 - Never commit your API key. Use environment variables through Vercel or your hosting provider.
 - SendGrid may rate-limit or block requests from new accounts until the account is verified.
 - Check SendGrid's Event Webhook if you want delivery/bounce events.

If you'd like, I can also:
 - Wire up the endpoint to use the official `@sendgrid/mail` npm package instead of a raw fetch call.
 - Add a minimal integration test that mocks SendGrid's API for local CI.
