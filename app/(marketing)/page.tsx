import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import HeroLanding from "@/components/sections/hero-landing"; // 只导入 HeroLanding
// import { PricingSection } from "@/components/sections/pricing"; // 如果不需要定价区，可注释这一行

export const metadata = constructMetadata({
  title: "OEON.CC - 一站式数字服务平台",
  description: "快速创建短链接、自定义域名服务，安全稳定，由 OEON.CC 论坛支持。",
  // keywords: "短链接, 域名邮箱, OEON.CC, 论坛支持",
  // 可以根据需要添加 openGraph / twitter 等
});

export default async function IndexPage() {
  const user = await getCurrentUser();

  return (
    <>
      <HeroLanding userId={user?.id} />
      {/* 已移除 <LandingImages />，因为功能介绍区已被隐藏 */}
      {/* <PricingSection /> // 如果不需要定价部分，注释或删除这一行 */}
    </>
  );
}