"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { siteConfig } from "@/config/site";
import { cn, fetcher } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import { InfiniteSlider } from "../ui/infinite-slider";
import { ProgressiveBlur } from "../ui/progressive-blur";
// import EmailManagerExp from "./email";       // 注释掉
// import PreviewLanding from "./preview-landing";  // 如果也想删就注释
// import UrlShortener from "./url-shortener";

export default function HeroLanding({
  userId,
}: {
  userId: string | undefined;
}) {
  const t = useTranslations("Landing");

  const { data: shortDomains, isLoading } = useSWR<{ domain_name: string }[]>(
    "/api/domain?feature=short",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  return (
    <section className="relative space-y-6 py-12 sm:py-16">
      <div className="container flex max-w-screen-lg flex-col items-center gap-5 text-center">
        {/* Vercel 部署按钮 - 如果不需要也可以删 */}
        <Link
          href={siteConfig.links.github}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4",
          )}
        >
          <span className="mr-1">🚀</span>
          {t("deployWithVercel")}&nbsp;
          <span className="font-bold" style={{ fontFamily: "Bahamas Bold" }}>
            Vercel
          </span>
          &nbsp;
          {t("now")}
        </Link>

        {/* 主标题 - 这里改成你的品牌 */}
        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          OEON.CC
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            一站式数字服务平台
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          {t("platformDescription")}  {/* 或直接改成你自己的描述 */}
          {/* 建议替换成：短链接、自定义域名、API 接口等服务，快速、安全、稳定。 */}
        </p>

        <div className="mb-10 flex items-center justify-center gap-4">
          <Link
            href="/docs/developer"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg", variant: "outline" }),
              "gap-2 bg-primary-foreground px-4 text-[15px] font-semibold text-primary hover:bg-slate-100",
            )}
          >
            <span>{t("documents")}</span>
            <Icons.bookOpen className="size-4" />
          </Link>
          <Link
            href="/dashboard"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "px-4 text-[15px] font-semibold",
            )}
          >
            <span>{userId ? t("Dashboard") : "立即开始使用 OEON.CC"}</span>
          </Link>
        </div>

        {/* 如果你不想显示预览组件，可以注释下面这行 */}
        {/* <PreviewLanding /> */}

        {/* 已激活域名滚动展示 - 保留，但把 wr.do 相关替换 */}
        <div className="group relative m-auto hidden max-w-4xl md:block">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-4 hidden md:mb-0 md:block md:max-w-44 md:border-r md:border-gray-600 md:pr-6">
              <p className="text-end text-sm text-blue-600">
                {t("Activated Domains")}
              </p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              <InfiniteSlider durationOnHover={20} duration={40} gap={112}>
                {isLoading
                  ? [1, 2, 3, 4].map(() => (
                      <span
                        className="text-lg"
                        style={{ fontFamily: "Bahamas Bold" }}
                      >
                        oeon.cc
                      </span>
                    ))
                  : shortDomains?.map((domain) => (
                      <span
                        className="text-lg"
                        style={{ fontFamily: "Bahamas Bold" }}
                      >
                        {domain.domain_name}
                      </span>
                    ))}
              </InfiniteSlider>

              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 以下所有小区块已全部移除 */}
    </section>
  );
}