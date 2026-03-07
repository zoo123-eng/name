import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import HeroLanding, { LandingImages } from "@/components/sections/hero-landing";
import { PricingSection } from "@/components/sections/pricing";

export const metadata = constructMetadata({
  title: "OEON.CC - 一站式数字服务平台",
  description: "快速创建短链接、自定义域名邮箱、文件存储等服务，安全稳定，由 OEON.CC 论坛支持。",
});

export default async function IndexPage() {
  const user = await getCurrentUser();
  return (
    <>
      <HeroLanding userId={user?.id} />
      <LandingImages />
      <PricingSection /> {/* 如果不需要，可注释 */}
    </>
  );
}