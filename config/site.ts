import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL || "https://name.oeon.cc";  // 改成你的域名
const email_r2_domain = env.NEXT_PUBLIC_EMAIL_R2_DOMAIN || "";
const support_email = env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@oeon.cc";  // 改成你的邮箱
const app_name = env.NEXT_PUBLIC_APP_NAME || "OEON.CC";  // ← 这里改成 OEON.CC

export const siteConfig: SiteConfig = {
  name: app_name,  // OEON.CC
  description:
    "OEON.CC 提供的短链接、域名邮箱、文件存储等一站式服务，由 OEON.CC 论坛支持。",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,  // 如果有自定义 og 图片，可换
  links: {
    twitter: "https://twitter.com/your-twitter",  // 可改或删
    github: "https://github.com/your-repo",  // 改成你的仓库
    feedback: "https://github.com/your-repo/issues",
    discord: "https://discord.gg/your-discord",  // 可改或删
    oichat: "https://oi.oeon.cc",  // 改成你的
  },
  mailSupport: support_email,
  emailR2Domain: email_r2_domain,
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/docs" },  // 可删或改 href
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
      { title: "Blog", href: "https://oeon.cc/blog" },  // 改成你的博客
      { title: "Feedback", href: siteConfig.links.feedback },
    ],
  },
  {
    title: "Products",
    items: [
      // 如果不想显示这些产品，可删掉整个数组或留空
      // { title: "LikeDo", href: "https://like.do" },
      // ... 其他
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Guide", href: "/docs/quick-start" },
      { title: "Developer", href: "/docs/developer" },
      { title: "Contact", href: siteConfig.mailSupport },
    ],
  },
];