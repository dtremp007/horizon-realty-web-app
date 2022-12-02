import { Button, Checkbox, FileButton, Modal, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";

type StyleEditorProps = {
  setUrl: (url: string) => void;
};

const StyleEditor = ({ setUrl }: StyleEditorProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      // get file url
      const url = URL.createObjectURL(file);
      setUrl(url);
    }
  }, [file]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 50,
          right: 0,
          margin: "1rem",
        }}
      >
        <Button onClick={() => setModalIsOpen((prev) => !prev)}>
          Style Editor
        </Button>
      </div>
      <Modal
        opened={modalIsOpen}
        onClose={() => setModalIsOpen((prev) => !prev)}
      >
        <FileButton
          onChange={setFile}
          accept="image/png, image/jpeg, image/jpg"
        >
          {(props) => <Button {...props}>Upload</Button>}
        </FileButton>
      </Modal>
    </>
  );
};
export default StyleEditor;
