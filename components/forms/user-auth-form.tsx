"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import * as z from "zod";

import { cn, fetcher } from "@/lib/utils";
import { userAuthSchema, userPasswordAuthSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

import { Skeleton } from "../ui/skeleton";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

type FormData = z.infer<typeof userAuthSchema>;
type FormData2 = z.infer<typeof userPasswordAuthSchema>;

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm<FormData2>({
    resolver: zodResolver(userPasswordAuthSchema),
  });
  const [isLoading, startTransition] = React.useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false);
  const [isLinuxDoLoading, setIsLinuxDoLoading] = React.useState<boolean>(false);
  const [suffixWhiteList, setSuffixWhiteList] = React.useState<string[]>([]);
  const searchParams = useSearchParams();

  const t = useTranslations("Auth");

  const { data: loginMethod, isLoading: isLoadingMethod } = useSWR<
    Record<string, any>
  >("/api/feature", fetcher, {
    revalidateOnFocus: false,
  });

  React.useEffect(() => {
    if (
      loginMethod &&
      !!loginMethod["enableSuffixLimit"] &&
      loginMethod["suffixWhiteList"].length > 0
    ) {
      setSuffixWhiteList(loginMethod["suffixWhiteList"].split(","));
    }
  }, [loginMethod]);

  const checkEmailSuffix = (email: string) => {
    if (suffixWhiteList.length > 0) {
      const suffix = email.split("@")[1];
      if (!suffixWhiteList.includes(suffix)) {
        toast.warning(
          t("Email domain not supported, Please use one of the following:"),
          {
            description: suffixWhiteList.join(", "),
          },
        );
        return false;
      }
    }
    return true;
  };

  async function onSubmitPwd(data: FormData2) {
    if (!checkEmailSuffix(data.email)) return;
    startTransition(async () => {
      const signInResult = await signIn("credentials", {
        name: data.name,
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/dashboard",
      });

      if (signInResult?.error) {
        toast.error(t("Something went wrong"), {
          description: `[${signInResult.error}]`,
        });
      } else {
        toast.success(t("Welcome back!"));
        window.location.reload();
      }
    });
  }

  const rendeSeparator = () => {
    return (
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("Or continue with")}
          </span>
        </div>
      </div>
    );
  };

  if (isLoadingMethod || !loginMethod) {
    return (
      <div className={cn("grid gap-3", className)} {...props}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const rendeCredentials = () =>
    loginMethod["credentials"] && (
      <form onSubmit={handleSubmit2(onSubmitPwd)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="email@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register2("email")}
            />
            {errors2?.email && (
              <p className="px-1 text-xs text-red-600">{errors2.email.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register2("password")}
            />
            {errors2?.password && (
              <p className="px-1 text-xs text-red-600">{errors2.password.message}</p>
            )}
          </div>
          <Button className="my-2" disabled={isLoading || isGoogleLoading || isGithubLoading}>
            {isLoading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            {t("Sign In / Sign Up")}
          </Button>
        </div>
      </form>
    );

  return (
    <div className={cn("grid gap-3", className)} {...props}>
      {!loginMethod.registration && (
        <p className="rounded-md border border-dashed bg-muted p-3 text-sm text-muted-foreground">
          📢 {t("Administrator has disabled new user registration")}.
        </p>
      )}

      {/* --- 重点：UI 伪装成 OEON，但逻辑调用 linuxdo --- */}
      {loginMethod["linuxdo"] && (
        <Button
          type="button"
          className="w-full bg-[#0073aa] text-white hover:bg-[#005177] py-6 text-base font-bold shadow-sm"
          onClick={() => {
            setIsLinuxDoLoading(true);
            signIn("linuxdo");
          }}
          disabled={!loginMethod.registration || isLoading || isGithubLoading || isGoogleLoading || isLinuxDoLoading}
        >
          {isLinuxDoLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.logo className="mr-2 size-5 fill-white" />
          )}
          使用 OEON 论坛快捷登录
        </Button>
      )}

      {loginMethod["credentials"] && <>{rendeCredentials()}</>}

      {(loginMethod["google"] ||
        loginMethod["github"]) &&
        rendeSeparator()}

      {loginMethod["google"] && (
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
          disabled={!loginMethod.registration || isLoading || isGoogleLoading || isGithubLoading || isLinuxDoLoading}
        >
          {isGoogleLoading ? <Icons.spinner className="mr-2 size-4 animate-spin" /> : <Icons.google className="mr-2 size-4" />} Google
        </Button>
      )}
      {loginMethod["github"] && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsGithubLoading(true);
            signIn("github");
          }}
          disabled={!loginMethod.registration || isLoading || isGithubLoading || isGoogleLoading || isLinuxDoLoading}
        >
          {isGithubLoading ? <Icons.spinner className="mr-2 size-4 animate-spin" /> : <Icons.github className="mr-2 size-4" />} Github
        </Button>
      )}
    </div>
  );
}
