import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
      <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm16 152h-24v-56h-16v-24h16v-16a28 28 0 0 1 28-28h24v24h-24a4 4 0 0 0-4 4v16h28l-4 24h-24Z" />
    </svg>
  ),
};
