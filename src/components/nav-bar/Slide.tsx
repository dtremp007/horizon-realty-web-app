import { getContextItemIndex } from "@mantine/utils";
import { useMenuContext } from "./AnimatedMenu.context";

type SlideProps = {
  children: React.ReactNode;
};

const Slide = ({ children }: SlideProps) => {
    const {cursor} = useMenuContext();

    if (getContextItemIndex() === cursor)
  return <>{children}</>;
};
export default Slide;
