# AWS Amplify Hosting

The frontend is a Next.js 15 application that requires Amplify Hosting
Compute. It is not a static S3 export.

## Create the app

1. Open AWS Amplify in `ap-south-1`.
2. Choose **Create new app** and connect GitHub.
3. Select `one9founders/frontend` and the `main` branch.
4. Keep the detected framework as **Next.js - SSR**.
5. Amplify will read `amplify.yml` from the repository.
6. Enable automatic builds for `main`.

## Environment variables

Configure these in **Hosting > Environment variables**:

```text
NEXT_PUBLIC_API_URL=https://api.one9founders.com
NEXT_PUBLIC_SITE_URL=https://www.one9founders.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<existing public Google client ID>
NEXT_PUBLIC_POSTHOG_KEY=<existing public PostHog project key>
NEXT_PUBLIC_POSTHOG_HOST=<existing PostHog host>
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<existing public reCAPTCHA site key>
```

Only add variables that are already used in the current production frontend.
Do not copy backend secrets, Product Hunt tokens, or private API keys into
Amplify.

## Verify before DNS cutover

Use the generated `*.amplifyapp.com` URL to verify:

- home, tool detail, agent detail, search, authentication, and admin flows;
- API requests go to `https://api.one9founders.com`;
- sitemap, robots, RSS, and redirects respond correctly;
- no browser console errors occur.

## Custom domain

After verification, add `one9founders.com` in **Hosting > Custom domains** and
map both the apex and `www` hostnames to `main`. Apply the DNS records Amplify
provides. Cut over DNS only after the Amplify domain is healthy.

Amplify provisions and renews the TLS certificate. Do not redeploy solely for
the DNS change.

## Rollback

If production verification fails, restore the previous DNS records. DNS
cutover is intentionally separate from application deployment.
