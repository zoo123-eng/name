"use client";

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
import PreviewLanding from "./preview-landing";  // 如果不要预览，注释这行 + 下面 <PreviewLanding />

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
        {/* 修改后的顶部小按钮：由 OEON.CC 论坛提供运行 */}
        <Link
          href="https://oeon.cc/"
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4 border-blue-400 text-blue-600 hover:bg-blue-50",
          )}
        >
          <span className="mr-1">ℹ️</span>
          由 OEON.CC 论坛提供运行
        </Link>

        {/* 主标题 */}
        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          OEON.CC
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            一站式数字服务平台
          </span>
        </h1>

        {/* 副标题 / 描述 */}
        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          快速创建短链接、自定义域名服务，安全稳定，由 OEON.CC 论坛支持。
        </p>

        {/* 按钮区：QQ群聊（淡蓝色） + 登录/仪表盘 */}
        <div className="mb-10 flex items-center justify-center gap-4 flex-wrap">
          {/* QQ群聊按钮 - 淡蓝色 outline */}
          <Link
            href="https://qun.qq.com/universal-share/share?ac=1&authKey=3yrjeQp0GpSEnVMwcqWSI1Apd%2BIHePoVnNYWZtk6kfL9NXxV6zbcQNxfPgNfgNVL&busi_data=eyJncm91cENvZGUiOiIxMDA0NTkwNjA1IiwidG9rZW4iOiJFcThhR1lralJPdDRwTzBBbWZBSUYvNEpldnlwb3ZmS1lXaktJMElUem5vUzVHWVJmZ2dWbkVKcHlwME1nTVRJIiwidWluIjoiMTQ5Mzk5MDU4NCJ9&data=RiuhusRkC1tViesrUz9YDSJbQPXqBUCgYcYZYpQOXQgNcfS2T5o7uwbqzJFl0gpqiuG6muar3OdvbPPHyTP6bA&svctype=4&tempid=h5_group_info"
            target="_blank"
            prefetch={false}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg", variant: "outline" }),
              "gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 font-semibold",
            )}
          >
            <span>QQ群聊</span>
            <Icons.messageCircle className="size-5" /> {/* 如果没有 messageCircle 图标，可删或换 Icons.users */}
          </Link>

          {/* 登录/仪表盘按钮 */}
          <Link
            href="/dashboard"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "px-6 text-[15px] font-semibold",
            )}
          >
            <span>{userId ? t("Dashboard") : "立即开始使用 OEON