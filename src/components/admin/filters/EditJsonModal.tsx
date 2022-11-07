import { Button, Group, JsonInput, Modal } from "@mantine/core";
import { useState } from "react";
import { IconEdit } from "@tabler/icons";
import { UseFormReturnType } from "@mantine/form";

type EditJsonModal<T> = {
  onClose: (values: T) => void;
  form: UseFormReturnType<T>;
};

const EditJsonModal = <T,>({ onClose, form }: EditJsonModal<T>) => {
  const [opened, setOpened] = useState(false);
  const [json, setJson] = useState("");

  const handleOnClose = () => {
    setOpened(false);
    onClose(JSON.parse(json));
  };

  return (
    <>
      <Modal opened={opened} onClose={handleOnClose} size={600}>
        <JsonInput
          autosize
          value={json}
          onChange={setJson}
          validationError="Invalid json"
        />
      </Modal>

      <Group position="center" mt={18}>
        <Button
          leftIcon={<IconEdit />}
          variant="light"
          color="teal"
          onClick={() => {
            setJson(JSON.stringify(form.values, null, 4));
            setOpened(true);
          }}
        >
          Edit JSON
        </Button>
      </Group>
    </>
  );
};
export default EditJsonModal;
