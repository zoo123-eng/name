import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL || "https://name.oeon.cc";
const email_r2_domain = env.NEXT_PUBLIC_EMAIL_R2_DOMAIN || "";
const support_email = env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@oeon.cc";
const app_name = env.NEXT_PUBLIC_APP_NAME || "OEON.CC";

export const siteConfig: SiteConfig = {
  name: app_name,
  description:
    "OEON.CC 提供的短链接、域名邮箱、文件存储等一站式服务，由 OEON.CC 论坛支持。",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/your-twitter",  // 可删或改
    github: "https://github.com/your-repo",       // 改成你的仓库
    feedback: "https://github.com/your-repo/issues",
    discord: "https://discord.gg/your-discord",
    oichat: "https://oi.oeon.cc",
  },
  mailSupport: support_email,
  emailR2Domain: email_r2_domain,
};

export const footerLinks: SidebarNavItem[] = [];  // ← 清空，去掉 Company/Products/Docs 所有模块