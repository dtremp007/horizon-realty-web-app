import { Button, Group, Modal, Text } from "@mantine/core";
import { IconThumbUp } from "@tabler/icons";

type ConfirmationModalProps = {
  opened: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => any;
};

const ConfirmationModal = ({
  opened,
  onClose,
  message,
  onConfirm,
}: ConfirmationModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose}>
      <Text>{message}</Text>
      <Group spacing="md" position="right" mt={16}>
        <Button color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button
          rightIcon={<IconThumbUp />}
          color="green"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm{" "}
        </Button>
      </Group>
    </Modal>
  );
};
export default ConfirmationModal;
