import type { SVGProps } from "react";
import Image from "next/image";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <Image
      src="https://scontent.fsdq5-1.fna.fbcdn.net/v/t39.30808-6/464333115_966007555565670_4128720996564005167_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=zf3MW-Awf3YQ7kNvwF1u0lt&_nc_oc=AdlkqkAAmfmpeAQI-F4T-0SbEk72wuNG6hU349B5y3moJh99SoB0A2LU2jLhHvXPXWo&_nc_zt=23&_nc_ht=scontent.fsdq5-1.fna&_nc_gid=fKhp1AjeHQV2zcPmbvquJQ&oh=00_Afgb9_lllERCC9ErjORuziFNVECj94KHfGD4kflgNk525Q&oe=691260A8"
      alt="Logo DIGEV"
      width={200}
      height={200}
      className={props.className}
      style={{ borderRadius: '50%' }}
    />
  ),
};
