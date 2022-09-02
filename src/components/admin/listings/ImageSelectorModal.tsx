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
  addUrl: (id: string, url: string) => void
};

type ImageRef = {
  id: string;
  url: string;
  ref: StorageReference;
  metadata: FullMetadata;
  selected: boolean;
};

const ImageSelectorModal = ({ opened, onClose, selectedUrls, addUrl }: ImageSelectorModalProps) => {
  const [images, setImages] = useState<ImageRef[]>([]);

  useEffect(() => {
    async function fetchAll() {
      const listRef = ref(storage, "test");
      const response = await listAll(listRef);
      return Promise.all(
        response.items.map(async (ref) => {
            const url = await getDownloadURL(ref)

            return {
                id: uuidv4(),
                ref,
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
          images.map((ref, index) => <ImageItem key={ref.id} {...ref} addUrl={addUrl}/>)
        ) : (
          <Spinner />
        )}
      </div>
    </Modal>
  );
};

type ImageItemProps = ImageRef & {addUrl: (id: string, url: string) => void}

const ImageItem = ({ id, url, ref, metadata, selected, addUrl }: ImageItemProps) => {
  return (
    <div className="image-selector__item">
      <Checkbox checked={selected} onChange={(e: any) => addUrl(id, url)}/>
      <Image src={url} height={100} width={100} />
      <p>{metadata.name}</p>
      <ActionIcon>
        <IconTrash/>
      </ActionIcon>
    </div>
  );
};

export default ImageSelectorModal;
