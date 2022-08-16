import { CheckboxGroup, Checkbox } from "@mantine/core"

type Props = {
    filterProps: any,
    value: string[],
    handleChange: Function
}

const CheckboxGroupWrapper = ({filterProps, value, handleChange}: Props) => {
  return (
    <CheckboxGroup orientation="vertical" size="md" value={value} onChange={handleChange as (e: any)=>any}>
        {filterProps.data.map((item: any) => <Checkbox key={item.value} {...item}/>)}
    </CheckboxGroup>
  )
}
export default CheckboxGroupWrapper
