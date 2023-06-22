import { ReactElement, ReactNode, useEffect } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import AppProvider from "@/providers/app";
import { useRouter } from "next/router";
import { useGetCsrfTokenQuery, useGetUserQuery } from "@/services";
import { CssBaseline } from "@mui/material";
import { BaseLayout } from "@/layouts";
import { LoadingSpinner } from "@/components";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AppProvider>
      <CssBaseline />
      <Authenticate publicRoutes={["/", "/login"]}>
        {getLayout(<Component {...pageProps} />)}
      </Authenticate>
    </AppProvider>
  );
}

interface ProtectedRoutesProps {
  children?: React.ReactNode;
  publicRoutes?: string[];
}

function Authenticate({ children, publicRoutes }: ProtectedRoutesProps) {
  const router = useRouter();
  const { data: user, isFetching } = useGetUserQuery();
  // csrf data is not used here directly but is still fetched so
  // that other queries can use the cached result
  const { data: csrf } = useGetCsrfTokenQuery();

  const isPublic = publicRoutes?.includes(router.asPath);

  console.log(user);

  useEffect(() => {
    // redirect to login page if unauthenticated
    if (!user && !isFetching) {
      if (isPublic) {
        return;
      } else {
        router.replace("/login");
      }
    }
  }, [user, isPublic, isFetching]);

  useEffect(() => {
    // redirect to overview page if already logged in
    if (user) {
      router.asPath === "/login" && router.replace("/overview");
    }
  }, [user, router.asPath]);

  if (isFetching) {
    return (
      <BaseLayout>
        <LoadingSpinner />
      </BaseLayout>
    );
  } else if (!user && !isPublic) {
    // hide authenticated content while user is fetched
    // or while useEffect redirects to login page
    return null;
  } else if (user && router.asPath === "/login") {
    // hide login page while useEffect redirects to overview page
    return null;
  } else return <>{children}</>;
}
