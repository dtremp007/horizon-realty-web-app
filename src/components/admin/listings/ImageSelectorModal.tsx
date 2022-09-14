import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Modal, Image, Checkbox, ActionIcon, Group } from "@mantine/core";
import {
  getDownloadURL,
  listAll,
  ref,
  StorageReference,
  getMetadata,
  FullMetadata,
  list,
  ListResult
} from "firebase/storage";
import { storage } from "../../../../lib/firebase.config";
import Spinner from "../../../shared/Spinner";
import { v4 as uuidv4 } from "uuid";
import { replaceById } from "./ImageUploader";
import {IconTrash} from "@tabler/icons"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";

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
  const pageRef = useRef<ListResult>();

  useEffect(() => {
    async function fetchAll() {
      const listRef = ref(storage, process.env.NODE_ENV === "development" ? "test" : "images");
      const response = await list(listRef, {maxResults: 6});
      pageRef.current = response
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
  }, [opened]);

  const fetchNext = useCallback(async () => {
    const listRef = ref(storage, process.env.NODE_ENV === "development" ? "test" : "images");
    const response = await list(listRef, {maxResults: 6, pageToken: pageRef.current?.nextPageToken});
    pageRef.current = response
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
  }, [selectedUrls])

  return (
    <Modal opened={opened} onClose={onClose} title="Pictures">
      <div className="image-selector__container">
        {images.length > 0 ? (
          images.map((ref, index) => <ImageItem key={ref.id} {...ref} updateUrl={updateUrl}/>)
        ) : (
          <Spinner />
        )}
        <Group position="apart">
            <ActionIcon disabled>
                <IconArrowLeft/>
            </ActionIcon>
            <ActionIcon onClick={() => fetchNext().then((data) => setImages(data))}>
                <IconArrowRight/>
            </ActionIcon>
        </Group>
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

    const thumbnail = useMemo(() => {
        const regexp = /(\.[^.]*?\?)/
        return url.replace(regexp, "_1280x720.jpeg?")
      }, [url]);

  return (
    <div className="image-selector__item">
      <Checkbox checked={checked} onChange={handleChange}/>
      <Image src={thumbnail} height={100} width={200} />
      <p>{metadata.name}</p>
      <ActionIcon>
        <IconTrash/>
      </ActionIcon>
    </div>
  );
};

export default ImageSelectorModal;
