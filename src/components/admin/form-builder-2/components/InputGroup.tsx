import { Flex, Text } from "@mantine/core";

type _InputGroupProps = {
  children: React.ReactNode;
  label?: string;
};

export type InputGroupProps = Partial<_InputGroupProps>;

const InputGroup = ({ children, label }: _InputGroupProps) => {
  return (
    <Flex direction="column" gap={8}>
      {label && <Text align="start">{label}</Text>}
      <Flex>{children}</Flex>
    </Flex>
  );
};
export default InputGroup;
