# EmailJS Setup Guide

Your portfolio is now configured to send messages directly to **2312067@nec.edu.in**. Follow these steps to activate it:

## Step 1: Create an EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email

## Step 2: Get Your User ID
1. After login, go to **Admin → Account** (Dashboard)
2. Copy your **User ID** (it looks like: `abcd1234efgh5678`)
3. Open `src/main.js` and replace:
   ```javascript
   const userId = 'YOUR_USER_ID_HERE';
   ```
   with your actual User ID:
   ```javascript
   const userId = 'abcd1234efgh5678'; // Your actual ID
   ```

## Step 3: Create an Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add Service**
3. Choose **Gmail** (or your preferred email provider)
4. Follow the prompts to connect your email account
5. Copy the **Service ID** (format: `service_xxxxx`)

## Step 4: Create an Email Template
1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use these field names in your template (they match what the form sends):
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{to_email}}` - Recipient email (2312067@nec.edu.in)
   - `{{message}}` - The message content
   - `{{reply_to}}` - Reply-to address

   **Example template:**
   ```
   Name: {{from_name}}
   Email: {{from_email}}
   
   Message:
   {{message}}
   ```

4. Copy the **Template ID** (format: `template_xxxxx`)

## Step 5: Update Your Code
In `src/main.js`, find this section and replace with your IDs:
```javascript
await emailjs.send(
  'service_YOUR_SERVICE_ID',  // ← Replace with your Service ID
  'template_YOUR_TEMPLATE_ID', // ← Replace with your Template ID
  {
    from_name: name,
    from_email: email,
    to_email: '2312067@nec.edu.in',
    message: message,
    reply_to: email
  }
);
```

## Step 6: Test Your Form
1. Visit your portfolio
2. Scroll to "Contact Me" section
3. Fill out the form and click **Send Message**
4. Check **2312067@nec.edu.in** for the email

## Troubleshooting

**Emails not arriving?**
- Check your EmailJS template syntax
- Verify Service ID and Template ID are correct
- Check spam folder
- Review EmailJS logs in the dashboard

**"Failed - Try Again" message?**
- Open browser console (F12) and check error messages
- Verify all three IDs (User ID, Service ID, Template ID) are correct
- Ensure your email service connection is verified

## Free Tier Limits
EmailJS free account includes:
- ✅ 200 emails/month
- ✅ Unlimited templates
- ✅ 5 email services

That's plenty for a portfolio contact form! 🚀
