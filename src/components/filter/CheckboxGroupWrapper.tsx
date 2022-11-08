import { Checkbox,Flex, Text } from "@mantine/core";

type Props = {
  filterProps: any;
  legend: string;
  handleChange: Function;
};

const CheckboxGroupWrapper = ({ filterProps, legend, handleChange }: Props) => {
  return (
    <Flex direction="column">
      {filterProps.data.map((item: any) => (
        <Checkbox key={item.value} onChange={handleChange} {...item} />
      ))}
    </Flex>
  );
};
export default CheckboxGroupWrapper;
