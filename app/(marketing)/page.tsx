import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import HeroLanding from "@/components/sections/hero-landing";

export const metadata = constructMetadata({
  title: "OEON.CC - 一站式数字服务平台",
  description: "OEON.CC 提供的子域名托管、域名邮箱服务，安全稳定，由 OEON.CC 论坛支持。",
});

export default async function IndexPage() {
  const user = await getCurrentUser();

  return (
    <>
      <HeroLanding userId={user?.id} />
      {/* 移除 PricingSection，防止额外区块 */}
      {/* <PricingSection /> */}
    </>
  );
}