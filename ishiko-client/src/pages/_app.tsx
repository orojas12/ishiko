import { ReactElement, ReactNode, useEffect } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import AppProvider from "@/providers/app";
import { useRouter } from "next/router";
import { useGetUserQuery } from "@/services";

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
      <ProtectedRoutes publicRoutes={["/", "/login"]}>
        {getLayout(<Component {...pageProps} />)}
      </ProtectedRoutes>
    </AppProvider>
  );
}

interface ProtectedRoutesProps {
  children?: React.ReactNode;
  publicRoutes?: string[];
}

function ProtectedRoutes({ children, publicRoutes }: ProtectedRoutesProps) {
  const router = useRouter();
  const { data: user } = useGetUserQuery();

  const isPublic = publicRoutes?.includes(router.asPath);

  useEffect(() => {
    if (!user) {
      if (isPublic) {
        return;
      } else {
        router.replace("/login");
      }
    }
  }, [user, isPublic]);

  useEffect(() => {
    if (user) {
      router.asPath === "/login" && router.replace("/");
    }
  }, [user, router.asPath]);

  if (!user && !isPublic) {
    return <h1>LOADING APP</h1>;
  } else {
    return <>{children}</>;
  }
}
