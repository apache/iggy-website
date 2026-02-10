import { HomeLayout } from "fumadocs-ui/layouts/home";
import { siteOptions } from "@/lib/layout.shared";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <HomeLayout {...siteOptions()}>{children}</HomeLayout>;
}
