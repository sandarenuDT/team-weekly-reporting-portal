export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Brand panel */}
      <div className="bg-brand-navy text-white md:w-[42%] flex flex-col justify-between px-8 py-10 md:px-14 md:py-16">
        <div>
          <p className="font-heading text-lg font-semibold tracking-tight">Weekly Reports</p>
          <p className="mt-4 text-blue-100/80 text-sm leading-relaxed max-w-xs hidden md:block">
            One place for your team to submit, review, and track weekly work — no
            spreadsheets, no chasing status updates.
          </p>
        </div>

        {/* Weekly grid motif — 7 columns (days) x 4 rows (weeks), a few
            cells lit up to suggest reports in progress. This is the one
            deliberate visual idea on the page; kept quiet everywhere else. */}
        <div className="hidden md:grid grid-cols-7 gap-2 max-w-xs mt-10">
          {Array.from({ length: 28 }).map((_, i) => {
            const lit = [2, 3, 9, 10, 11, 17, 23, 24].includes(i);
            return (
              <div
                key={i}
                className={`aspect-square rounded-sm ${
                  lit ? 'bg-brand-sky' : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>

        <p className="text-blue-100/50 text-xs mt-10 md:mt-0">
          &copy; {new Date().getFullYear()} Weekly Reports
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <p className="text-brand-600 text-xs font-medium tracking-wide mb-2">{eyebrow}</p>
          <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}