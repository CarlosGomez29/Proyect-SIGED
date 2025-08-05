import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.08V15h-2v-2h2v-1.92c0-2.11 1.28-3.08 3-3.08.88 0 1.62.06 1.83.09v1.82h-1.09c-1.03 0-1.23.49-1.23 1.2v1.89h2.16l-.28 2h-1.88v2.08c-2.02.43-3.8.1-4.71-.42z"/>
    </svg>
  ),
};
