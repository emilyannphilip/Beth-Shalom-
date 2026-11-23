import Image from "next/image";
import type { ComponentProps } from "react";

export function PortalLogo({
  alt,
  width = 1254,
  height = 1254,
  ...props
}: Omit<ComponentProps<typeof Image>, "src">) {
  return (
    <Image
      {...props}
      alt={alt}
      src="/beth-shalom-portal/assets/beth-shalom-logo.jpg"
      width={width}
      height={height}
      unoptimized
    />
  );
}
