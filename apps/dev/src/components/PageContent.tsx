import clsx from "clsx";
import { ReactNode } from "react";

export type PageContentProps = JSX.IntrinsicElements["div"] & { heading?: ReactNode };

export function PageContent({ children, className, heading, ...props }: PageContentProps) {
  let _heading;
  if (heading) {
    _heading = <h2 className="text-2xl [&+*]:mt-12">{heading}</h2>;
  }

  return (
    <div {...props} className={clsx("mx-auto w-full max-w-[768px] p-8", className)}>
      {_heading}
      {children}
    </div>
  );
}
