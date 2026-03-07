// ... 前面代码保持不变 ...

      {loginMethod["linuxdo"] && (
        <Button
          type="button"
          className="w-full bg-[#0073aa] text-white hover:bg-[#005177] py-6 text-base font-bold shadow-sm"
          onClick={() => {
            setIsLinuxDoLoading(true);
            // 核心：逻辑依然调用 linuxdo，完全不改 ID
            signIn("linuxdo");
          }}
          disabled={!loginMethod.registration || isLoading || isGithubLoading || isGoogleLoading || isLinuxDoLoading}
        >
          {isLinuxDoLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            // 这里换成你的 logo 或者 icons.logo
            <Icons.logo className="mr-2 size-5 fill-white" />
          )}
          使用 OEON 论坛快捷登录
        </Button>
      )}

// ... 后面代码保持不变，确保渲染 separator 的逻辑正确 ...
