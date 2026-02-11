import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SurveyEmailParams {
  to: string;
  founderName: string;
  companyName: string;
  vcFirmName: string;
  calendarYear: number;
  surveyUrl: string;
}

export async function sendSurveyInvitationEmail({
  to,
  founderName,
  companyName,
  vcFirmName,
  calendarYear,
  surveyUrl,
}: SurveyEmailParams) {
  const subject = `Demographic Data Survey — ${vcFirmName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #1a365d; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { color: #1a365d; font-size: 20px; margin: 0; }
        .content { margin-bottom: 32px; }
        .cta-button { display: inline-block; background-color: #1a365d; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 24px 0; }
        .notice { background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 16px; margin: 20px 0; font-size: 14px; }
        .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 32px; font-size: 13px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Venture Capital Demographic Data Survey</h1>
      </div>

      <div class="content">
        <p>Dear ${founderName},</p>

        <p>${vcFirmName} has made a venture capital investment in <strong>${companyName}</strong> during calendar year <strong>${calendarYear}</strong>.</p>

        <p>Under California's <strong>Fair Investment Practices by Venture Capital Companies Law</strong> (Corp. Code, § 27500 et seq.), ${vcFirmName} is required to offer founding team members the opportunity to voluntarily provide demographic information via a standardized survey developed by the California Department of Financial Protection and Innovation (DFPI).</p>

        <div class="notice">
          <strong>Your participation is completely voluntary.</strong> No adverse action will be taken against you if you decline to participate in the survey. Your individual responses will be anonymized and only aggregated data will be reported to the DFPI.
        </div>

        <p>Please click the button below to access the survey:</p>

        <a href="${surveyUrl}" class="cta-button">Complete Survey</a>

        <p>The survey covers the following demographic categories:</p>
        <ul>
          <li>Gender Identity</li>
          <li>Race/Ethnicity</li>
          <li>LGBTQ+ Status</li>
          <li>Disability Status</li>
          <li>Veteran Status</li>
          <li>California Residency</li>
        </ul>

        <p>You may also choose to decline to answer any or all questions.</p>
      </div>

      <div class="footer">
        <p><strong>Important:</strong> Do not return completed surveys to the DFPI directly. Your responses are collected by ${vcFirmName} and reported only in aggregated, anonymized form.</p>
        <p>If you have questions about this law, please contact the DFPI at <a href="mailto:VCC_Support@dfpi.ca.gov">VCC_Support@dfpi.ca.gov</a> or call (866) 275-2677.</p>
        <p>Business: ${companyName} | Calendar Year: ${calendarYear}</p>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "compliance@example.com",
      to,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send survey email:", error);
    return { success: false, error };
  }
}
