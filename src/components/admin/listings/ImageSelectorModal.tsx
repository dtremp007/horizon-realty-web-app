import { useState, useEffect } from "react";
import { Modal, Image, Checkbox, ActionIcon } from "@mantine/core";
import {
  getDownloadURL,
  listAll,
  ref,
  StorageReference,
  getMetadata,
  FullMetadata
} from "firebase/storage";
import { storage } from "../../../../lib/firebase.config";
import Spinner from "../../../shared/Spinner";
import { v4 as uuidv4 } from "uuid";
import { replaceById } from "./ImageUploader";
import {IconTrash} from "@tabler/icons"

type ImageSelectorModalProps = {
  opened: boolean;
  onClose: () => void;
  selectedUrls: string[];
  updateUrl: (id: string, url: string, action: "add" | "remove") => void
};

type ImageRef = {
  id: string;
  url: string;
  storageRef: StorageReference;
  metadata: FullMetadata;
  selected: boolean;
};

const ImageSelectorModal = ({ opened, onClose, selectedUrls, updateUrl }: ImageSelectorModalProps) => {
  const [images, setImages] = useState<ImageRef[]>([]);

  useEffect(() => {
    async function fetchAll() {
      const listRef = ref(storage, "images");
      const response = await listAll(listRef);
      return Promise.all(
        response.items.map(async (ref) => {
            const url = await getDownloadURL(ref)

            return {
                id: uuidv4(),
                storageRef: ref,
                url,
                metadata: await getMetadata(ref),
                selected: selectedUrls.includes(url)
            }
        })
      );
    }

    fetchAll().then((data) => setImages(data));
  }, []);

  return (
    <Modal opened={opened} onClose={onClose} title="Pictures">
      <div className="image-selector__container">
        {images.length > 0 ? (
          images.map((ref, index) => <ImageItem key={ref.id} {...ref} updateUrl={updateUrl}/>)
        ) : (
          <Spinner />
        )}
      </div>
    </Modal>
  );
};

type ImageItemProps = ImageRef & {updateUrl: (id: string, url: string, action: "add" | "remove") => void}

const ImageItem = ({ id, url, storageRef, metadata, selected, updateUrl }: ImageItemProps) => {
    const [checked, setChecked] = useState(selected)

    function handleChange (e:any) {
        if (e.target.checked) {
            updateUrl(id, url, "add")
        } else {
            updateUrl(id, url, "remove")
        }
        setChecked(e.target.checked)
    }

  return (
    <div className="image-selector__item">
      <Checkbox checked={checked} onChange={handleChange}/>
      <Image src={url} height={100} width={200} />
      <p>{metadata.name}</p>
      <ActionIcon>
        <IconTrash/>
      </ActionIcon>
    </div>
  );
};

export default ImageSelectorModal;
