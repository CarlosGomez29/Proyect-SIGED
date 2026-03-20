import type { SVGProps } from "react";
import Image from "next/image";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <Image
      src="/img/logo-digev.jpg"
      alt="Logo DIGEV"
      width={200}
      height={200}
      className={props.className}
      style={{ borderRadius: '50%' }}
    />
  ),
};
