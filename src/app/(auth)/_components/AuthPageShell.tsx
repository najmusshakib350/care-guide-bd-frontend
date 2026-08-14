import Image from "next/image";
import type { ReactNode } from "react";

import {
  authFormColumnClassName,
  authIllustrationClassName,
  authIllustrationColumnClassName,
  authPageContainerClassName,
  authPageGridClassName,
  authPageSectionClassName,
  authShapeClassName,
} from "../auth-styles";

type AuthPageShellProps = {
  illustrationSrc: string;
  illustrationAlt: string;
  children: ReactNode;
};

export function AuthPageShell({
  illustrationSrc,
  illustrationAlt,
  children,
}: AuthPageShellProps) {
  return (
    <section className={authPageSectionClassName}>
      <div className={`${authShapeClassName} top-0 left-0`}>
        <Image
          src="/auth/shape1.svg"
          alt=""
          width={176}
          height={540}
          className="h-auto w-auto"
          sizes="176px"
        />
      </div>
      <div className={`${authShapeClassName} top-0 right-5`}>
        <Image
          src="/auth/shape2.svg"
          alt=""
          width={568}
          height={400}
          className="h-auto w-auto"
          sizes="400px"
        />
      </div>
      <div className={`${authShapeClassName} right-[327px] bottom-0`}>
        <Image
          src="/auth/shape3.svg"
          alt=""
          width={568}
          height={548}
          className="h-auto w-auto"
          sizes="400px"
        />
      </div>

      <div className={authPageContainerClassName}>
        <div className={authPageGridClassName}>
          <div className={`hidden lg:block ${authIllustrationColumnClassName}`}>
            <Image
              src={illustrationSrc}
              alt={illustrationAlt}
              width={633}
              height={500}
              className={authIllustrationClassName}
              sizes="(max-width: 1024px) 90vw, 633px"
              priority
            />
          </div>
          <div className={authFormColumnClassName}>{children}</div>
        </div>
      </div>
    </section>
  );
}
