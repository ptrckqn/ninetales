import { useCallback } from "react";
import { useRouter } from "next/router";

export default function useRouterRefresh() {
  const router = useRouter();
  const refresh = useCallback(() => router.replace(router.asPath), [router.asPath]);

  return refresh;
}
