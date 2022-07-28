import React, { MouseEventHandler } from "react";

type Props = {
  text?: string;
  variant?: "primary" | "secondary" | "icon" |"custom";
  className?: string;
  children?: React.ReactNode;
  onClick?: MouseEventHandler;
};

/**
 * This component returns simple button element. By default it set to primary. You can pass in a
 * className and it will be appended to `"btn btn-primary"`. If you wish to completely
 * override the className, set variant to `"custom"`.
 *
 * The default styling is `flex-flow: row wrap`. You can pass in multiple elements like icons.
 *
 * If you want this button to navigate to another page, use `router.push`:
 *
 * ```
 * <DefaultButton onClick={() => router.push('/about')}>
      Click me
    </DefaultButton>
    ```
    Eventually I might need to add `forwardRef()` if I want access the `ref` property.
 */
export default function DefaultButton({
  variant = "primary",
  className,
  children,
  onClick,
}: Props) {
  return (
    <button onClick={onClick} className={createClassList(variant, className)}>
      {children}
    </button>
  );
}

const createClassList = (variant: string, className?: string) => {
    if (variant === "custom") {
        return className;
    } else if (variant === "icon") {
        return `btn-icon ${className || ""}`
    } else if (variant === "primary"){
        return `btn btn-primary ${className || ""}`
    } else if (variant === "secondary") {
        return `btn btn-secondary ${className || ""}`
    }
}
