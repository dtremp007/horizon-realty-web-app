import { Flex } from "@mantine/core";
import { AnimatedMenuProvider } from "./AnimatedMenu.context";
import Slide from "./Slide";
import useCascadingAnimation from "./useCascadingAnimation"
import { getContextItemIndex } from "@mantine/utils";

const AnimatedMenu = () => {
    const {page_right, root} = useCascadingAnimation({});

    const getItemIndex = (node: HTMLElement) => getContextItemIndex("[data-menu-slide]", ".transition", node)

  return (
    <AnimatedMenuProvider value={{
        cursor: 0,
        getItemIndex
    }}>
    <Flex ref={root}>
        <Slide>
            {/* Slide 1 */}
        </Slide>
        <Slide>
            {/* Slide 2 */}
        </Slide>
    </Flex>
    </AnimatedMenuProvider>
  )
}
export default AnimatedMenu
