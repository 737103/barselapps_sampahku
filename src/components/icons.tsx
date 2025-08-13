import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="hsl(var(--primary) / 0.2)" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <path d="M15.5 8.5c-1.2 0-2.3.4-3.2.9" />
      <path d="M12 12v5" />
      <path
        d="M17 10c0 .9-.2 1.8-.6 2.6"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
      />
      <path
        d="M22 10.5c0 .8-.2 1.6-.5 2.3"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
      />
    </svg>
  ),
};
