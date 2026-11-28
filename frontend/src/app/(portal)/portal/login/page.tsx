import type { Metadata } from "next";
import { PortalLogin } from "@/features/portal/screens/login";
export const metadata: Metadata = {
  title: { absolute: "Portal Login — Beth Shalom Retirement Home" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; passwordChanged?: string }>;
}) {
  const params = await searchParams;
  return (
    <PortalLogin
      expired={params.expired === "1"}
      passwordChanged={params.passwordChanged === "1"}
    />
  );
}
