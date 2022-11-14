import { Button, Flex } from "@mantine/core";
import { AnimatedMenuProvider } from "./AnimatedMenu.context";
import Slide from "./Slide";
import { getContextItemIndex } from "@mantine/utils";
import { useState } from "react";
import { css } from "@emotion/react";

const AnimatedMenu = () => {
  const [cursor, setCursor] = useState(0);
  const [classes, setClasses] = useState("");

  const getItemIndex = (node: HTMLElement) =>
    getContextItemIndex("[data-menu-slide]", "[data-menu-root]", node);

  const open = () => {
    setCursor(1);
    setClasses("enter__top");
  };

  const close = () => {
    setClasses("exit__top");
    setTimeout(() => {
      setCursor(0);
    }, 400);
  };

  const go_right = () => {
    setClasses("exit__left");
    setTimeout(() => {
      setCursor((x) => ++x);
      setClasses("enter__right");
    }, 400);
  };

  const go_left = () => {
    setClasses("exit__right");
    setTimeout(() => {
      setCursor((x) => --x);
      setClasses("enter__left");
    }, 400);
  };

  return (
    <AnimatedMenuProvider
      value={{
        cursor,
        classes,
        getItemIndex,
      }}
    >
      <Button onClick={open}>Open</Button>
      <Button onClick={close}>Close</Button>
      <Button onClick={go_left}>Left</Button>
      <Button onClick={go_right}>Right</Button>
      <Flex data-menu-root direction="column" align="center">
        <Slide>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </Slide>
        <Slide>
          <div>Item2</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </Slide>
        <Slide>
          <div>Item3</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </Slide>
      </Flex>
    </AnimatedMenuProvider>
  );
};
export default AnimatedMenu;
