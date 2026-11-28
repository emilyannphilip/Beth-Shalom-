import type { Metadata } from "next";
import { PasswordScreen } from "@/features/portal/screens/password";
export const metadata: Metadata = {
  title: "Reset Password — Beth Shalom",
  referrer: "no-referrer",
};
export default function Page() {
  return <PasswordScreen mode="reset" />;
}
