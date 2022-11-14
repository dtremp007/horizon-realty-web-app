import { Button, Flex } from "@mantine/core";
import AnimatedMenu from "./AnimatedMenu";
import useCascadingAnimation from "./useCascadingAnimation";

export default { title: "AnimatedMenu" };

export function ItOpens() {
  const { open, close, go_left, go_right, root } = useCascadingAnimation({});

  return (
    <>
    <Button onClick={() => open()}>Open</Button>
    <Button onClick={() => close()}>Close</Button>
    <Button onClick={() => go_left()}>Left</Button>
    <Button onClick={() => go_right()}>Right</Button>
    <div ref={root}>
      <Flex direction="column">
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </Flex>
      <Flex direction="column">
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </Flex>
    </div>
    </>
  );
}
