import { Flex } from "@mantine/core";
import { getContextItemIndex } from "@mantine/utils";
import { forwardRef, useEffect, useRef } from "react";
import { useMenuContext } from "./AnimatedMenu.context";

type SlideProps = {
  children: React.ReactNode;
};

const Slide = ({ children }: SlideProps) => {
  const { cursor, classes, getItemIndex } = useMenuContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(getItemIndex(ref.current))
  }, [])

  return (
    <Flex
      data-menu-slide
      ref={ref}
      sx={{
        display: getItemIndex(ref.current!) + 1 === cursor ? undefined : "none",
      }}
      direction="column"
      className={`transition ${classes}`}
    >
      {children}
    </Flex>
  );
};
export default Slide;
