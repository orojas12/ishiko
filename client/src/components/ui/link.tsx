import NextLink from "next/link";
import type { LinkProps } from "next/link";

type NextLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>;

export function Link(props: NextLinkProps) {
  return <NextLink className="hover:underline" {...props} />;
}
