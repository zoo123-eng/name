import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      {/* 完全去掉 Company/Products/Docs 表格 */}
      {/* <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">...</div> */}

      {/* 只保留一行居中版权（可根据需要修改文字） */}
      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-center text-sm text-muted-foreground">
          Copyright {new Date().getFullYear()} © OEON.CC - 由 OEON.CC 论坛支持
        </div>
      </div>
    </footer>
  );
}