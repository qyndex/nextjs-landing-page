export function LogoBar() {
  // PLACEHOLDER: Replace these with actual customer/partner logo SVGs or images
  const logos = [
    { name: "Acme Corp", initials: "AC" },
    { name: "Globex", initials: "GX" },
    { name: "Initech", initials: "IT" },
    { name: "Umbrella", initials: "UM" },
    { name: "Hooli", initials: "HO" },
    { name: "Pied Piper", initials: "PP" },
  ];

  return (
    <div className="py-12 border-y border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by teams at world-class companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              title={logo.name}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-bold">
                {logo.initials}
              </div>
              <span className="text-sm font-semibold">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
