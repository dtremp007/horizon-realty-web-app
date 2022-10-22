import { ActionIcon, Modal } from "@mantine/core";
import { IconHelp } from "@tabler/icons";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const HelpModal = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} size={600}>
        <ReactMarkdown>
         # Docs
        </ReactMarkdown>
      </Modal>

      <div style={{ position: "fixed", right: "1rem", bottom: "1rem" }}>
        <ActionIcon size="xl" onClick={() => setOpened(true)}>
          <IconHelp size={30} />
        </ActionIcon>
      </div>
    </>
  );
};
export default HelpModal;
