import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Image, Checkbox, ActionIcon, Group, Modal } from "@mantine/core";
import {
  getDownloadURL,
  listAll,
  ref,
  StorageReference,
  getMetadata,
  FullMetadata,
  list,
  ListResult,
} from "firebase/storage";
import { storage } from "../../../../lib/firebase.config";
import Spinner from "../../../shared/Spinner";
import { v4 as uuidv4 } from "uuid";
import { replaceById } from "./ImageUploader";
import { IconTrash } from "@tabler/icons";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons";

type ImageSelectorModalProps = {
  opened: boolean;
  onClose: () => void;
  selectedUrls: string[];
  updateUrl: (id: string, url: string, action: "add" | "remove") => void;
};

type ImageRef = {
  id: string;
  url: string;
  storageRef: StorageReference;
  metadata: FullMetadata;
  selected: boolean;
};

const ImageSelectorModal = ({
  opened,
  onClose,
  selectedUrls,
  updateUrl,
}: ImageSelectorModalProps) => {
  const [images, setImages] = useState<ImageRef[]>([]);
  const allFiles = useRef<(StorageReference & { metadata?: FullMetadata })[]>();
  const pageRef = useRef<
    ListResult & { prevPageToken?: (string | undefined)[] }
  >();
  const pagination = useRef({
    cursor: 0,
    pageSize: 10,
    arrayLength: 0,
    walk: function () {
      this.cursor += this.pageSize;
      if (this.cursor >= this.arrayLength) this.cursor = 0;
    },
    backtrack: function () {
      this.cursor -= this.pageSize;
      if (this.cursor < 0) this.cursor = this.arrayLength - this.pageSize;
    },
    next: function () {
      this.walk();
      console.log(this.cursor, " / ", this.arrayLength);
      const start = this.cursor;
      return [start, start + this.pageSize];
    },
    prev: function () {
      this.backtrack();
      const start = this.cursor;
      return [start, start + this.pageSize];
    },
  });

  const fetchAll_2 = useCallback(async () => {
    const listRef = ref(storage, "images");
    allFiles.current = (await listAll(listRef)).items;
  }, []);

  const sortByDate = async () => {
    await new Promise<void>(async (resolve, reject) => {
      for (const ref of allFiles.current!) {
        ref.metadata = await getMetadata(ref);
      }
      resolve();
    });

    allFiles.current!.sort((a, b) => {
      if (!a.metadata || !b.metadata) return 0;
      return a.metadata!.updated.localeCompare(b.metadata!.updated) * -1;
    });
  };

  useEffect(() => {
    async function fetchAll() {
      await fetchAll_2();
      await sortByDate();
      pagination.current.arrayLength = allFiles.current!.length;

      return Promise.all(
        allFiles
          .current!.slice(0, pagination.current.pageSize)
          .map(async (ref) => {
            const url = await getDownloadURL(ref);

            return {
              id: uuidv4(),
              storageRef: ref,
              url,
              metadata: await getMetadata(ref),
              selected: selectedUrls.includes(url),
            };
          })
      );
    }

    fetchAll().then((data) => setImages(data));
  }, [opened]);

  const fetchNext = useCallback(
    async (dir: "next" | "prev") => {
      const [start, end] = pagination.current[dir]() as number[];

      return Promise.all(
        allFiles.current!.slice(start, end).map(async (ref) => {
          const url = await getDownloadURL(ref);

          return {
            id: uuidv4(),
            storageRef: ref,
            url,
            metadata: await getMetadata(ref),
            selected: selectedUrls.includes(url),
          };
        })
      );
    },
    [selectedUrls]
  );

  return (
    <Modal opened={opened} onClose={onClose} title="Pictures">
      <div className="image-selector__container">
        {images.length > 0 ? (
          images.map((ref, index) => (
            <ImageItem key={ref.id} {...ref} updateUrl={updateUrl} />
          ))
        ) : (
          <Spinner />
        )}
        <Group position="apart">
          <ActionIcon
            onClick={() => fetchNext("prev").then((data) => setImages(data))}
          >
            <IconArrowLeft />
          </ActionIcon>
          <ActionIcon
            onClick={() => fetchNext("next").then((data) => setImages(data))}
          >
            <IconArrowRight />
          </ActionIcon>
        </Group>
      </div>
    </Modal>
  );
};

type ImageItemProps = ImageRef & {
  updateUrl: (id: string, url: string, action: "add" | "remove") => void;
};

const ImageItem = ({
  id,
  url,
  storageRef,
  metadata,
  selected,
  updateUrl,
}: ImageItemProps) => {
  const [checked, setChecked] = useState(selected);

  function handleChange(e: any) {
    if (e.target.checked) {
      updateUrl(id, url, "add");
    } else {
      updateUrl(id, url, "remove");
    }
    setChecked(e.target.checked);
  }

  return (
    <div className="image-selector__item">
      <Checkbox checked={checked} onChange={handleChange} />
      <Image src={url} height={100} width={200} withPlaceholder/>
      <p>{metadata.name}</p>
      <ActionIcon>
        <IconTrash />
      </ActionIcon>
    </div>
  );
};

export default ImageSelectorModal;
