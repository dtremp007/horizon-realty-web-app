import { Box, Button } from "@mantine/core";
import { useRef } from "react";

type TheBoxProps = {
  children: React.ReactNode;
};

const TheBox = ({ children }: TheBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <Box
        sx={{
          display: "none",
        }}
        ref={ref}
        className="flex--column"
      >
        {children}
      </Box>
      <Button onClick={() => ref.current?.classList.toggle("flex--column")}>Toggle</Button>
    </>
  );
};
export default TheBox;
