"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useSWR from "swr";

import { siteConfig } from "@/config/site";
import { cn, fetcher } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { InfiniteSlider } from "../ui/infinite-slider";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { Separator } from "../ui/separator";
import PreviewLanding from "./preview-landing";
import EmailManagerExp from "./email";

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
        {/* 顶部小按钮 */}
        <Link
          href="https://oeon.cc/"
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4 border-blue-400 text-blue-600 hover:bg-blue-50",
          )}
        >
          <span className="mr-1">🚀</span>
          由 OEON.CC 论坛提供运行
        </Link>

        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          OEON.CC
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            一站式数字服务平台
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          OEON.CC 提供的子域名托管、域名邮箱服务，安全稳定，由 OEON.CC 论坛支持。
        </p>

        <div className="mb-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="https://qun.qq.com/universal-share/share?ac=1&authKey=3yrjeQp0GpSEnVMwcqWSI1Apd%2BIHePoVnNYWZtk6kfL9NXxV6zbcQNxfPgNfgNVL&busi_data=eyJncm91cENvZGUiOiIxMDA0NTkwNjA1IiwidG9rZW4iOiJFcThhR1lralJPdDRwTzBBbWZBSUYvNEpldnlwb3ZmS1lXaktJMElUem5vUzVHWVJmZ2dWbkVKcHlwME1nTVRJIiwidWluIjoiMTQ5Mzk5MDU4NCJ9&data=RiuhusRkC1tViesrUz9YDSJbQPXqBUCgYcYZYpQOXQgNcfS2T5o7uwbqzJFl0gpqiuG6muar3OdvbPPHyTP6bA&svctype=4&tempid=h5_group_info"
            target="_blank"
            prefetch={false}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg", variant: "outline" }),
              "gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 font-semibold",
            )}
          >
            QQ群聊
          </Link>

          <Link
            href="/dashboard"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "px-6 text-[15px] font-semibold",
            )}
          >
            <span>{userId ? t("Dashboard") : "免费登入"}</span>
          </Link>
        </div>

        <PreviewLanding />

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

      {/* 只保留两个模块：子域名托管 + 域名邮箱 */}
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-mono font-semibold uppercase tracking-wider text-blue-600">
            {t("FEATURES")}
          </h2>
          <p className="text-balance text-2xl font-semibold text-muted-foreground">
            核心服务
          </p>
        </div>

        {/* 子域名托管服务 */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              子域名托管服务
            </h3>
            <p className="font-semibold text-muted-foreground">
              轻松创建和管理自定义子域名，支持快速解析和灵活配置
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.link className="mr-2 size-4" />
                  自定义子域名
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  完全自定义子域名后缀，支持多级子域名，适合品牌展示或个人站点
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.clock className="mr-2 size-4" />
                  即时生效
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  新建子域名后立即生效，无需等待 DNS 传播
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.shieldCheck className="mr-2 size-4" />
                  安全管理
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  支持权限控制和访问日志，防止滥用
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt="子域名托管示例"
                src="/_static/landing/hosting.svg"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>

        {/* 域名邮箱服务 */}
        <div className="mt-16 grid gap-12 sm:px-12 lg:grid-cols-12 lg:gap-24 lg:px-0">
          <div className="items-start px-2 py-4 text-left lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-blue-500 md:text-3xl">
              域名邮箱服务
            </h3>
            <p className="font-semibold text-muted-foreground">
              使用自己的域名收发邮件，专业又个性化
            </p>

            <div className="mt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.mail className="mr-2 size-4" />
                  自定义邮箱地址
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  任意@yourdomain.com 邮箱地址，支持别名和转发
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.inbox className="mr-2 size-4" />
                  无限容量
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  无存储限制，随时收发重要邮件
                </CollapsibleContent>
              </Collapsible>
              <Separator />
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center py-3 hover:underline">
                  <Icons.shieldCheck className="mr-2 size-4" />
                  反垃圾与安全
                  <Icons.chevronDown className="ml-auto size-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-3 text-sm text-muted-foreground">
                  内置反垃圾过滤和加密传输，保护隐私
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          <div className="text-clip rounded-xl border py-4 md:p-3.5 lg:col-span-7">
            <div className="flex size-full items-center justify-center rounded-lg border p-3 md:bg-muted/50">
              <Image
                className="size-[350px] rounded-lg transition-all hover:border hover:opacity-90 hover:shadow-xl"
                alt="域名邮箱示例"
                src="/_static/landing/email.svg"
                width={280}
                height={280}
              />
            </div>
          </div>
        </div>

        {/* 如果不需要 demo 区，可注释掉下面 */}
        {/* <div className="grids grids-dark mx-auto my-12 flex w-full max-w-6xl px-4">
          <UrlShortener />
          <EmailManagerExp />
        </div> */}
      </div>
    </section>
  );
}