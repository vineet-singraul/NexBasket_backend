const { Resend } = require("resend");

// Render blocks outbound SMTP traffic on its network, so raw SMTP (nodemailer +
// Gmail) can never connect from a Render-hosted server. Resend sends over a
// plain HTTPS API call instead, which isn't blocked.
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "NexBasket <onboarding@resend.dev>";

const sendOtpEmail = async (toEmail, otp) => {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "Verify your email - OTP",
    html: `<h2>Your OTP is: ${otp}</h2><p>This OTP will expire in 5 minutes.</p>`,
  });
  if (error) throw new Error(error.message || "Failed to send OTP email");
};





const sentOtpEmailInCreateStoreTime = async ({
  toEmail,
  password,
  storeLogo,
  storeBanner,
}) => {
  const bannerRow = storeBanner
    ? `<tr>
        <td>
            <img src="${storeBanner}" alt="Store Banner" width="100%" style="display:block;">
        </td>
    </tr>`
    : "";

  const logoRow = storeLogo
    ? `<tr>
        <td align="center" style="padding-top:25px;">
            <img src="${storeLogo}"
                 alt="Store Logo"
                 width="90"
                 height="90"
                 style="border-radius:50%;border:4px solid #ffffff;box-shadow:0 5px 15px rgba(0,0,0,.15);">
        </td>
    </tr>`
    : "";

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "🎉 Your NexBasket Store Has Been Created Successfully",
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Store Created</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:30px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08);">

    <!-- Banner -->
    ${bannerRow}

    <!-- Logo -->
    ${logoRow}

    <!-- Title -->
    <tr>
        <td align="center" style="padding:20px 40px 10px;">
            <h1 style="margin:0;color:#222;font-size:30px;">
                🎉 Congratulations!
            </h1>

            <p style="font-size:16px;color:#666;line-height:28px;">
                Your <strong>NexBasket Store</strong> has been created successfully.
                You can now log in using the password below.
            </p>
        </td>
    </tr>

    <!-- Password Box -->
    <tr>
        <td align="center" style="padding:20px;">
            <table cellpadding="0" cellspacing="0"
                style="background:#f8f9ff;border:2px dashed #4f46e5;border-radius:10px;padding:20px 40px;">
                <tr>
                    <td align="center">
                        <p style="margin:0;color:#666;font-size:14px;">
                            Your Temporary Password
                        </p>

                        <h2 style="
                            margin:12px 0 0;
                            font-size:32px;
                            letter-spacing:4px;
                            color:#4f46e5;">
                            ${password}
                        </h2>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- Important Note -->
    <tr>
        <td style="padding:10px 40px;">
            <div style="
                background:#fff7e6;
                border-left:5px solid #ff9800;
                padding:18px;
                border-radius:6px;
                color:#555;
                line-height:26px;">
                <strong>Security Tip</strong><br><br>
                This password has been generated automatically.
                Please log in and change your password immediately
                for better account security.
            </div>
        </td>
    </tr>

    <!-- Button -->
    <tr>
        <td align="center" style="padding:35px;">
            <a href="https://yourwebsite.com/login"
               style="
               background:#4f46e5;
               color:#ffffff;
               text-decoration:none;
               padding:15px 40px;
               border-radius:8px;
               font-size:16px;
               font-weight:bold;
               display:inline-block;">
               Login to Your Store
            </a>
        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td align="center"
            style="
            background:#f5f5f5;
            color:#777;
            padding:30px;
            font-size:14px;
            line-height:24px;">

            <strong>NexBasket Team</strong><br>
            Thank you for choosing NexBasket ❤️<br><br>

            If you didn't create this account,
            please contact our support team immediately.
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
  });
  if (error) throw new Error(error.message || "Failed to send store-created email");
};



module.exports = { sendOtpEmail, sentOtpEmailInCreateStoreTime };