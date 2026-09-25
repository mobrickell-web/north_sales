import { readFileSync } from "fs";
import path from "path";

export type AppointmentDetails = {
  companyName: string;
  email: string;
  appointmentType: string;
  date: string;
  time: string;
  duration: string;
};

const BRAND = {
  navy: "#001528",
  navySoft: "#112238",
  bronze: "#b17411",
  bronzeSoft: "#C99B31",
  cream: "#FAF9F5",
  white: "#ffffff",
  muted: "#5C5F66",
  border: "#E8E4DC",
  rowAlt: "#F7F5F0",
};

const LOGO_CID = "north-logo";

export function getEmailLogoAttachment() {
  const logoPath = path.join(process.cwd(), "public", "logo", "north-logo.svg");
  return {
    filename: "north-logo.svg",
    content: readFileSync(logoPath),
    cid: LOGO_CID,
    contentType: "image/svg+xml" as const,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function detailRows(rows: { label: string; value: string; href?: string }[]) {
  return rows
    .map((row, index) => {
      const bg = index % 2 === 0 ? BRAND.rowAlt : BRAND.white;
      const valueHtml = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:${BRAND.bronze};text-decoration:none;font-weight:600;">${escapeHtml(row.value)}</a>`
        : escapeHtml(row.value);

      return `
        <tr>
          <td style="padding:12px 16px;background:${bg};border-bottom:1px solid ${BRAND.border};font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};width:38%;vertical-align:top;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding:12px 16px;background:${bg};border-bottom:1px solid ${BRAND.border};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:${BRAND.navy};vertical-align:top;">
            ${valueHtml}
          </td>
        </tr>
      `;
    })
    .join("");
}

function emailShell({
  badge,
  heading,
  introHtml,
  detailsHeading,
  rows,
  afterHtml,
  footerNote,
}: {
  badge: string;
  heading: string;
  introHtml: string;
  detailsHeading: string;
  rows: { label: string; value: string; href?: string }[];
  afterHtml?: string;
  footerNote: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.cream};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.cream};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${BRAND.white};border-radius:16px;overflow:hidden;border:1px solid ${BRAND.border};box-shadow:0 8px 28px rgba(0,21,40,0.08);">
          <tr>
            <td style="background:${BRAND.navy};padding:28px 32px 24px;text-align:center;">
              <img src="cid:${LOGO_CID}" alt="NORTH POINT SALES GROUP" width="220" style="display:block;margin:0 auto 18px;width:220px;max-width:70%;height:auto;border:0;" />
              <div style="display:inline-block;padding:6px 14px;border:1px solid rgba(193,155,49,0.55);border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.bronzeSoft};">
                ${escapeHtml(badge)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, ${BRAND.bronze} 0%, ${BRAND.bronzeSoft} 50%, ${BRAND.bronze} 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 28px 8px;">
              <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:700;color:${BRAND.navy};">
                ${escapeHtml(heading)}
              </h1>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${BRAND.muted};">
                ${introHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 8px;">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.bronze};">
                ${escapeHtml(detailsHeading)}
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
                ${detailRows(rows)}
              </table>
            </td>
          </tr>
          ${
            afterHtml
              ? `<tr><td style="padding:20px 28px 8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:${BRAND.muted};">${afterHtml}</td></tr>`
              : ""
          }
          <tr>
            <td style="padding:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.navySoft};border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;text-align:center;">
                    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:${BRAND.white};">
                      NORTH POINT SALES GROUP
                    </p>
                    <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#C9D1D9;">
                      <a href="mailto:contact@northpointsalesgroup.com" style="color:${BRAND.bronzeSoft};text-decoration:none;">contact@northpointsalesgroup.com</a>
                      &nbsp;·&nbsp;
                      <a href="tel:+19702501439" style="color:${BRAND.bronzeSoft};text-decoration:none;">(970) 250-1439</a>
                    </p>
                    <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9AA3AD;">
                      ${escapeHtml(footerNote)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8F98;text-align:center;">
          Serving clients nationwide · Improving established sales organizations
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildAppointmentEmails(details: AppointmentDetails) {
  const rows = [
    { label: "Company", value: details.companyName },
    {
      label: "Email",
      value: details.email,
      href: `mailto:${details.email}`,
    },
    { label: "Appointment Type", value: details.appointmentType },
    { label: "Date", value: details.date },
    { label: "Available Time", value: details.time },
    { label: "Duration", value: details.duration },
  ];

  const detailsText = [
    `Prospect / Company Name: ${details.companyName}`,
    `Prospect Email: ${details.email}`,
    `Appointment Type: ${details.appointmentType}`,
    `Date: ${details.date}`,
    `Available Time: ${details.time}`,
    `Meeting Duration: ${details.duration}`,
  ].join("\n");

  const internalSubject = `New Appointment Request — ${details.companyName}`;
  const internalText = [
    "New appointment request from the NORTH POINT SALES GROUP website:",
    "",
    detailsText,
  ].join("\n");

  const internalHtml = emailShell({
    badge: "New Lead · Website Form",
    heading: "New Appointment Request",
    introHtml: `
      <p style="margin:0 0 10px;">A prospect just submitted the schedule form on the NORTH POINT SALES GROUP website.</p>
      <p style="margin:0;">Review the details below and follow up promptly.</p>
    `,
    detailsHeading: "Request Details",
    rows,
    afterHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.cream};border:1px solid ${BRAND.border};border-radius:10px;">
        <tr>
          <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:${BRAND.navy};">
            <strong style="color:${BRAND.bronze};">Tip:</strong>
            Reply directly to this email to reach
            <a href="mailto:${escapeHtml(details.email)}" style="color:${BRAND.bronze};text-decoration:none;font-weight:700;">${escapeHtml(details.email)}</a>.
          </td>
        </tr>
      </table>
    `,
    footerNote: "Internal notification from northpointsalesgroup.com",
  });

  const confirmationSubject =
    "We received your appointment request — NORTH POINT SALES GROUP";
  const confirmationText = [
    `Hi ${details.companyName},`,
    "",
    "Thank you for scheduling an appointment with NORTH POINT SALES GROUP.",
    "We have received your request and will follow up shortly.",
    "",
    "Your request details:",
    detailsText,
    "",
    "If you need to make changes, reply to this email or contact us at contact@northpointsalesgroup.com.",
    "",
    "— NORTH POINT SALES GROUP",
  ].join("\n");

  const confirmationHtml = emailShell({
    badge: "Confirmation",
    heading: "We've received your request",
    introHtml: `
      <p style="margin:0 0 10px;">Hi <strong style="color:${BRAND.navy};">${escapeHtml(details.companyName)}</strong>,</p>
      <p style="margin:0 0 10px;">Thank you for scheduling an appointment with <strong style="color:${BRAND.navy};">NORTH POINT SALES GROUP</strong>.</p>
      <p style="margin:0;">Your request is confirmed on our side. A member of our team will follow up shortly to finalize the conversation.</p>
    `,
    detailsHeading: "Your Appointment Details",
    rows,
    afterHtml: `
      <p style="margin:0 0 12px;">Need to change anything? Just reply to this email or reach us at
        <a href="mailto:contact@northpointsalesgroup.com" style="color:${BRAND.bronze};text-decoration:none;font-weight:700;">contact@northpointsalesgroup.com</a>.
      </p>
      <p style="margin:0;color:${BRAND.navy};font-weight:600;">We look forward to speaking with you.</p>
    `,
    footerNote: "This is an automated confirmation of your website request",
  });

  return {
    internalSubject,
    internalText,
    internalHtml,
    confirmationSubject,
    confirmationText,
    confirmationHtml,
  };
}
