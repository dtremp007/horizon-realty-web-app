import { Accordion } from "@mantine/core";

type _AccordionInputGroupProps = {
    children: React.ReactNode;
    label: string;
    value?: string;
}

const AccordionInputGroup = ({children, label, value}: _AccordionInputGroupProps) => {
  return (
    <Accordion >
      <Accordion.Item value={value || label}>
        <Accordion.Control>{label}</Accordion.Control>
        <Accordion.Panel>{children}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
export default AccordionInputGroup;
