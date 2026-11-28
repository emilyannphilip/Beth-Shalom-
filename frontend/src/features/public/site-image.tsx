import Image from "next/image";
import type { ComponentProps, CSSProperties } from "react";

type SiteImageProps = Omit<
  ComponentProps<"img">,
  "src" | "alt" | "width" | "height" | "style"
> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

export function SiteImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  ...props
}: SiteImageProps) {
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={src.startsWith("https://")}
        loading={loading}
        decoding={decoding}
        {...props}
      />
    );
  }

  // These source images are sized by their surrounding CSS. Keep their intrinsic sizing.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading={loading} decoding={decoding} {...props} />
  );
}
