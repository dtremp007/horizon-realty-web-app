import { Button } from "@mantine/core";
import { useState } from "react";
import ConfirmationModal from "./ComfirmationModal";

export default { title: "ConfirmationModal", component: ConfirmationModal };

export function Primary(props: Omit<React.ComponentPropsWithoutRef<typeof ConfirmationModal>, 'opened' | 'onClose'>) {
  const [opened, setOpened] = useState(false);

  return (
    <div style={{ padding: 50 }}>
      <Button onClick={() => setOpened(true)}>Open Modal</Button>
      <ConfirmationModal
        opened={opened}
        onClose={() => setOpened(false)}
        {...props}
      />
    </div>
  );
}
