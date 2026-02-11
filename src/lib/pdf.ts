import { ReportData } from "./aggregation";

/**
 * Generates the DFPI Venture Capital Demographic Data Report as a structured
 * HTML document suitable for PDF conversion. The actual PDF rendering is done
 * client-side using the browser's print functionality or a PDF library.
 */
export function generateReportHTML(report: ReportData): string {
  const { calendarYear, vcFirmName, partI, partII, investmentDetails } = report;

  const formatPercent = (val: number) => val.toFixed(1);
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Venture Capital Demographic Data Report - ${calendarYear}</title>
      <style>
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
          line-height: 1.4;
          color: #000;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.75in;
        }
        h1 {
          text-align: center;
          font-size: 16pt;
          margin-bottom: 4px;
        }
        h2 {
          font-size: 13pt;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
          margin-top: 24px;
        }
        h3 {
          font-size: 12pt;
          margin-top: 16px;
        }
        .subtitle {
          text-align: center;
          font-size: 11pt;
          margin-bottom: 24px;
        }
        .firm-info {
          margin-bottom: 24px;
        }
        .firm-info p {
          margin: 4px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 10pt;
        }
        th, td {
          border: 1px solid #000;
          padding: 6px 8px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        td.number {
          text-align: right;
        }
        .section-note {
          font-size: 9pt;
          font-style: italic;
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <h1>Venture Capital Demographic Data Report</h1>
      <p class="subtitle">California Department of Financial Protection and Innovation</p>

      <div class="firm-info">
        <p><strong>Covered Entity (VC Firm):</strong> ${vcFirmName}</p>
        <p><strong>Calendar Year:</strong> ${calendarYear}</p>
        <p><strong>Total Survey Responses Received:</strong> ${partI.totalResponses}</p>
      </div>

      <h2>Part I: Aggregated Survey Demographic Data Responses</h2>
      <p class="section-note">
        The following table presents the total number of survey responses received
        for each demographic category. Respondents may select multiple options within
        each category; therefore, totals may exceed the number of respondents.
      </p>
  `;

  // Part I tables
  for (const category of partI.demographics) {
    html += `
      <h3>${category.category}</h3>
      <table>
        <thead>
          <tr>
            <th>Response Option</th>
            <th style="width: 120px; text-align: right;">Count</th>
          </tr>
        </thead>
        <tbody>
    `;
    for (const item of category.counts) {
      html += `
          <tr>
            <td>${item.label}</td>
            <td class="number">${item.count}</td>
          </tr>
      `;
    }
    html += `
        </tbody>
      </table>
    `;
  }

  html += `
      <h3>Decline to State for All Responses</h3>
      <table>
        <tbody>
          <tr>
            <td>Decline to state for all responses</td>
            <td class="number" style="width: 120px;">${partI.declineAllCount}</td>
          </tr>
        </tbody>
      </table>
  `;

  // Part II
  html += `
      <div class="page-break"></div>
      <h2>Part II: Investments to Businesses Primarily Founded by Diverse Founding Team Members</h2>

      <h3>Item 1: By Number of Investments</h3>
      <table>
        <tbody>
          <tr>
            <td>Number of VC investments to businesses primarily founded by diverse founding team members</td>
            <td class="number" style="width: 100px;">${partII.item1And2.diverseInvestmentCount}</td>
          </tr>
          <tr>
            <td>Total number of VC investments</td>
            <td class="number">${partII.item1And2.totalInvestmentCount}</td>
          </tr>
          <tr>
            <td><strong>Percentage</strong></td>
            <td class="number"><strong>${formatPercent(partII.item1And2.diverseInvestmentPercentage)}%</strong></td>
          </tr>
        </tbody>
      </table>

      <h3>Item 2: By Dollar Amount of Investments</h3>
      <table>
        <tbody>
          <tr>
            <td>Dollar amount of VC investments to businesses primarily founded by diverse founding team members</td>
            <td class="number" style="width: 150px;">${formatCurrency(partII.item1And2.diverseInvestmentDollars)}</td>
          </tr>
          <tr>
            <td>Total dollar amount of VC investments</td>
            <td class="number">${formatCurrency(partII.item1And2.totalInvestmentDollars)}</td>
          </tr>
          <tr>
            <td><strong>Percentage</strong></td>
            <td class="number"><strong>${formatPercent(partII.item1And2.diverseDollarPercentage)}%</strong></td>
          </tr>
        </tbody>
      </table>

      <h3>Item 3: Breakdown by Demographic Category</h3>
      <p class="section-note">
        A business qualifies for a demographic category if it is primarily founded by diverse
        founding team members AND at least one responding founder selected that demographic option.
      </p>
      <table>
        <thead>
          <tr>
            <th>Demographic Category</th>
            <th style="width: 130px; text-align: right;">(A) % by Number</th>
            <th style="width: 130px; text-align: right;">(B) % by Dollars</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (const cat of partII.item3.categories) {
    html += `
          <tr>
            <td>${cat.label}</td>
            <td class="number">${formatPercent(cat.investmentCountPercentage)}%</td>
            <td class="number">${formatPercent(cat.investmentDollarPercentage)}%</td>
          </tr>
    `;
  }

  html += `
        </tbody>
      </table>
  `;

  // Part III: Investment Details
  html += `
      <div class="page-break"></div>
      <h2>Part III: Investment Details</h2>
      <p class="section-note">
        Amount of venture capital investment and principal place of business for each
        business receiving funding in calendar year ${calendarYear}.
      </p>
      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th style="width: 160px; text-align: right;">Total VC Investment</th>
            <th style="width: 200px;">Principal Place of Business</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (const detail of investmentDetails) {
    html += `
          <tr>
            <td>${detail.businessName}</td>
            <td class="number">${formatCurrency(detail.totalInvestmentAmount)}</td>
            <td>${detail.principalPlaceOfBusiness}</td>
          </tr>
    `;
  }

  html += `
        </tbody>
      </table>

      <div class="firm-info" style="margin-top: 48px;">
        <p><strong>Certification:</strong></p>
        <p>I certify that the information provided in this report is true and correct to the best of my knowledge.</p>
        <br>
        <p>Signature: ________________________________</p>
        <p>Name: ________________________________</p>
        <p>Title: ________________________________</p>
        <p>Date: ________________________________</p>
      </div>
    </body>
    </html>
  `;

  return html;
}
