import { useMediaQuery } from "@mantine/hooks";
import type { MediaQuery } from "../../../lib/interfaces/FunctionTypes";
import {useRouter} from "next/router"
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  when?: boolean;
  breakpoint?: MediaQuery;
  initialValue?: boolean;
  alt?: React.ReactNode;
  altOptions?:
    | "never"
    | "conditionFails"
    | "breakpointFails"
    | "always"
    | "force";
  forceAlt?: boolean;
  blacklistRoutes?: string[];
};

/**
 * At the moment, if you give this function alternative elements, it automatically render them
 * when it fails the conditions. If you need this function to be more robust, you'll have to add
 * on to it in the future.
 *
 * @param initialValue - this is for SSR. It tells the server whether to pre-render as if the
 * query is true or false. True by default.
 * @param forceAlt - this will overide the default elements when condition is true.
 * @returns
 */
const Show = ({
  children,
  when = true,
  breakpoint,
  initialValue = true,
  alt,
  altOptions = "always",
  forceAlt = false,
  blacklistRoutes
}: Props) => {
   const [isBlacklisted, setIsBlacklisted] = useState(false)
  const query = breakpoint ? `screen and ${breakpoint}` : "screen";
  const isInMediaQuery = useMediaQuery(query, initialValue);
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    if (blacklistRoutes && blacklistRoutes.includes(currentPath)) {
         setIsBlacklisted(true)
    } else {
        setIsBlacklisted(false)
    }
  }, [currentPath])

  if (forceAlt && !isBlacklisted && isInMediaQuery) {
    return <>{alt}</>
  }

  if (when && isInMediaQuery && !isBlacklisted) {
    return <>{children}</>;
  }

  if (alt && altOptions === "always" && !isBlacklisted && isInMediaQuery) {
    return <>{alt}</>
  }

 if (alt && altOptions === "conditionFails" && !when && isInMediaQuery) {
    return <>{alt}</>
 }

  return null;
};
export default Show;
