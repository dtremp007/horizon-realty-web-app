import { CheckboxGroup, Checkbox, Group, Text } from "@mantine/core";

type Props = {
  filterProps: any;
  legend: string;
  handleChange: Function;
};

const CheckboxGroupWrapper = ({ filterProps, legend, handleChange }: Props) => {
  return (
    <Group direction="column">
      {filterProps.data.map((item: any) => (
        <Checkbox key={item.value} onChange={handleChange} {...item} />
      ))}
    </Group>
  );
};
export default CheckboxGroupWrapper;
