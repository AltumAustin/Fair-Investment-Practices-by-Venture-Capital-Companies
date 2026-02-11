import Link from "next/link";

function ShieldIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">VC Comply</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              California Corp. Code &sect; 27500 et seq.
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              DFPI Compliance,{" "}
              <span className="text-blue-900">Simplified</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              The all-in-one platform for venture capital firms to comply with California&apos;s
              Fair Investment Practices law. Distribute surveys, collect responses, and
              generate your annual DFPI report in minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto bg-blue-900 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-blue-800 transition-colors shadow-sm">
                Start Free Setup
              </Link>
              <Link href="/login" className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-50 transition-colors">
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-500 mt-1">Statutory Compliant</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">&lt; 5 min</p>
              <p className="text-sm text-gray-500 mt-1">Report Generation</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Anonymous</p>
              <p className="text-sm text-gray-500 mt-1">Response Collection</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Aggregate</p>
              <p className="text-sm text-gray-500 mt-1">Data Only Reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
              Three simple steps to full compliance with California&apos;s demographic data reporting requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">1</div>
                <h3 className="text-lg font-semibold text-gray-900">Distribute Surveys</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                Send the DFPI-mandated Venture Capital Demographic Data Survey to founding team members of your portfolio companies with one click. Passive investors are automatically excluded.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">2</div>
                <h3 className="text-lg font-semibold text-gray-900">Collect Responses</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                Founders receive a secure, token-based link to complete the survey. Participation is voluntary and responses are stored anonymously. Individual data is never disclosed.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">3</div>
                <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">
                Automatically generate your completed DFPI Venture Capital Demographic Data Report with all three required parts. Export as PDF and submit before the April 1 deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Built for VC Compliance</h2>
            <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
              Every feature designed to meet the specific requirements of California Corp. Code &sect; 27500.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 mb-4">
                <MailIcon />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Automated Survey Distribution</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Send surveys to all eligible founding team members with a single click. Batch processing for your entire portfolio.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 mb-4">
                <LockIcon />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Anonymous &amp; Voluntary</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Responses are collected anonymously per statutory requirements. Founders can decline any or all questions. Individual data is never shown.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-700 mb-4">
                <ChartIcon />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">DFPI Report Generation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Auto-generate the complete three-part DFPI report with demographic aggregation, diverse investment analysis, and investment details.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700 mb-4">
                <UsersIcon />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Passive Investor Exclusion</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mark founding team members as passive investors to automatically exclude them from survey distribution, as required by the statute.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 mb-4">
                <ClipboardIcon />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Statutory Formula Calculations</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automatically determines &ldquo;primarily founded by diverse founding team members&rdquo; using the exact statutory formula from &sect; 27500.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-700 mb-4">
                <ShieldIcon />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Aggregate-Only Reporting</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Only aggregated, anonymized data appears in reports. Individual survey responses are never disclosed to your firm or the DFPI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Report Preview */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Complete DFPI Report</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                The platform generates the full Venture Capital Demographic Data Report matching the DFPI&apos;s required format, ready for submission before the April 1 annual deadline.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="font-medium text-gray-900">Part I: Aggregated Demographics</p>
                    <p className="text-sm text-gray-500">Gender, race/ethnicity, LGBTQ+, disability, and veteran status counts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="font-medium text-gray-900">Part II: Diverse Investment Analysis</p>
                    <p className="text-sm text-gray-500">Percentage of investments to primarily diverse-founded businesses, by count and dollar amount</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="font-medium text-gray-900">Part III: Investment Details</p>
                    <p className="text-sm text-gray-500">Business names, total VC investment amounts, and principal places of business</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="font-medium text-gray-900">PDF Export</p>
                    <p className="text-sm text-gray-500">One-click PDF generation ready for DFPI submission</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 lg:p-8">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="text-center mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Sample Report Preview</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">Venture Capital Demographic Data Report</p>
                  <p className="text-xs text-gray-500">Calendar Year 2025</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Part I &mdash; Survey Responses</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 rounded px-2 py-1.5 text-center">
                        <p className="text-sm font-bold text-gray-900">12</p>
                        <p className="text-[10px] text-gray-500">Surveyed</p>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1.5 text-center">
                        <p className="text-sm font-bold text-gray-900">9</p>
                        <p className="text-[10px] text-gray-500">Responded</p>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1.5 text-center">
                        <p className="text-sm font-bold text-gray-900">75%</p>
                        <p className="text-[10px] text-gray-500">Rate</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Part II &mdash; Diverse Investments</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 rounded px-2 py-1.5 text-center">
                        <p className="text-sm font-bold text-blue-900">60%</p>
                        <p className="text-[10px] text-blue-700">By Count</p>
                      </div>
                      <div className="bg-blue-50 rounded px-2 py-1.5 text-center">
                        <p className="text-sm font-bold text-blue-900">45%</p>
                        <p className="text-[10px] text-blue-700">By Dollars</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Part III &mdash; Investments</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span className="text-gray-600">GreenTech Solutions</span><span className="font-medium text-gray-900">$2.5M</span></div>
                      <div className="flex justify-between text-xs"><span className="text-gray-600">MediCore Health</span><span className="font-medium text-gray-900">$5.0M</span></div>
                      <div className="flex justify-between text-xs"><span className="text-gray-600">DataStream Analytics</span><span className="font-medium text-gray-900">$1.5M</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Simplify Your DFPI Compliance?</h2>
          <p className="text-lg text-blue-200 mb-8 max-w-xl mx-auto">
            Set up your firm in minutes. Start distributing surveys and generating reports today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-white text-blue-900 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-blue-50 transition-colors">
              Create Your Account
            </Link>
            <Link href="/login" className="w-full sm:w-auto border border-blue-400 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-blue-800 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-900 rounded-md flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900">VC Comply</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Compliance platform for California&apos;s Fair Investment Practices by Venture Capital Companies Law.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Sign In</Link></li>
                <li><Link href="/register" className="text-sm text-gray-500 hover:text-gray-900">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Legal Reference</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-500">Corp. Code &sect; 27500&ndash;27507</li>
                <li className="text-sm text-gray-500">DFPI Annual Report Requirement</li>
                <li className="text-sm text-gray-500">Due April 1 of each year</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} VC Comply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
