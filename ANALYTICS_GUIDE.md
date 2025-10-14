# Google Analytics 4 - Setup Guide

## Overview
Your website is now tracking user behavior with Google Analytics 4 (GA4). This allows you to understand how visitors interact with your site.

## Measurement ID
**G-GFJPNSXCQ4**

## What's Being Tracked

### Automatic Tracking
- **Page Views**: Every page visit is automatically tracked
- **User Sessions**: How long users stay on your site
- **Device & Browser Info**: What devices and browsers visitors use
- **Geographic Location**: Where your visitors are from
- **Traffic Sources**: How people find your site (Google, direct, social media, etc.)

### Custom Event Tracking
The following custom events are tracked:

1. **Contact Form Submissions**
   - Tracks when someone submits your contact form
   - Category: "Form" / "Contact"
   - Label: "Contact Form Submission"

2. **Resume Downloads**
   - Tracks when someone downloads your resume PDF
   - Category: "Download"
   - Label: "Resume PDF"

3. **Project Views**
   - Tracks which projects visitors view
   - Category: "Project"
   - Label: [Project Title]

## Viewing Your Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Select your property

### Key Reports to Check:

#### Realtime Report
- See who's on your site RIGHT NOW
- **Reports** → **Realtime**

#### Traffic Overview
- Total users, sessions, and pageviews
- **Reports** → **Lifecycle** → **Acquisition** → **Traffic acquisition**

#### Page Performance
- Which pages get the most views
- **Reports** → **Engagement** → **Pages and screens**

#### Events
- See your custom events (form submissions, downloads, project views)
- **Reports** → **Engagement** → **Events**

#### Geographic Data
- Where your visitors are from
- **Reports** → **User** → **User attributes** → **Demographic details**

## Adding More Tracking

The analytics utility file is located at: `src/utils/analytics.ts`

### Available Functions:

```typescript
// Log a custom event
logEvent('Category', 'Action', 'Label', value)

// Log a button click
logButtonClick('Button Name')

// Log a link click
logLinkClick('Link Name', 'Destination')

// Log a form submission
logFormSubmit('Form Name')

// Log a project view
logProjectView('Project Title')

// Log a download
logDownload('File Name')
```

### Example: Track Button Clicks

Add this to any component:

```tsx
import { logButtonClick } from '../utils/analytics'

// In your onClick handler:
onClick={() => {
  logButtonClick('CTA Button - Services Page')
  // ... rest of your code
}}
```

## Privacy & Compliance

Google Analytics 4 is more privacy-focused than older versions:
- IP addresses are anonymized by default
- Respects Do Not Track browser settings
- GDPR compliant when configured properly

### Cookie Consent (Optional)
If you want to add a cookie consent banner, you can use packages like:
- `react-cookie-consent`
- `@cookie-consent/react`

## Troubleshooting

### Not seeing data?
1. Make sure you deployed the changes to production
2. Wait 24-48 hours for data to start appearing
3. Check the Realtime report to see if live tracking works
4. Verify your Measurement ID is correct: **G-GFJPNSXCQ4**

### Testing locally
Analytics will work in development mode too. Just visit your localhost and check the Realtime report in GA4.

## Next Steps

Consider setting up:
1. **Conversion Goals**: Track specific actions (e.g., "Contact Form Submitted")
2. **Enhanced Measurement**: Scroll tracking, file downloads, site search
3. **Audience Reports**: Understand your visitor demographics
4. **Custom Dashboards**: Create personalized views of your most important metrics

## Support

For more info on GA4:
- [Google Analytics Documentation](https://support.google.com/analytics)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
