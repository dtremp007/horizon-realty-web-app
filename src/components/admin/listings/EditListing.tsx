import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';

const EditListing = () => {
    const form = useForm({
        initialValues: {
            name:"",
        }
    })

  return (
    <form>
        <TextInput placeholder='Name' {...form.getInputProps("name")}/>
    </form>
  )
}
export default EditListing
