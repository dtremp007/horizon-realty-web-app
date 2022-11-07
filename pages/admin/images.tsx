import { GetServerSideProps, NextPage } from "next";
import {
  getDocs,
  collection,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import { ListingSchema } from "../../lib/interfaces/Listings";
import { useCallback, useEffect, useMemo, useState } from "react";
import analyzeDocs from "../../src/image-manager/src/ImageRef";
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Image,
  List,
  ScrollArea,
  Text,
} from "@mantine/core";
import { CopyButton, Flex, Tooltip, Menu, Switch } from "@mantine/core-5.7.0";
import { ImageCellType, ImageRefType } from "../../src/image-manager/src/types";
import {
  deleteObject,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import {
  IconPhotoOff,
  IconHome,
  IconTrash,
  IconCheck,
  IconCopy,
  IconDotsVertical,
} from "@tabler/icons";
import Link from "next/link";

type Props = {
  firebaseDocs: {
    id: string;
    data: ListingSchema;
  }[];
};

const Images: NextPage<Props> = ({ firebaseDocs: docs }) => {
  const [firebaseDocs, setFirebaseDocs] = useState(
    new Map([...docs].map((doc) => [doc.id, doc]))
  );
  const [IRCMap, setIRCMap] = useState<Map<string, ImageRefType>>();
  const [saveTime, setTimeSaver] = useState(true);
  const [opened, setOpened] = useState(false);

  const handleAnalyzer = useCallback(() => {
    analyzeDocs("images", firebaseDocs).then((map) => {
      setIRCMap(map);
    });
  }, []);

  return (
    <Flex direction="column" m={16}>
      <Flex align="center" justify="space-between">
        <h1 style={{ padding: "1rem" }}>Image Analyzer</h1>
        <Flex align="center">
          <Menu opened={opened} onChange={setOpened}>
            <Menu.Target>
              <ActionIcon>
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Options</Menu.Label>
              <Menu.Item>
                <Switch
                  checked={saveTime}
                  onChange={(event) =>
                    setTimeSaver(event.currentTarget.checked)
                  }
                  label="Don't load heavy images"
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button onClick={handleAnalyzer} mr={18}>Analyze</Button>
          <Button>Save</Button>
        </Flex>
      </Flex>
      <ScrollArea style={{ height: "calc(100vh - 180px)", width: "100%" }}>
        {IRCMap ? (
          <Flex direction="column" style={{ width: "100%" }}>
            {[...IRCMap].sort(sortIRCMap).map(([key, imageRef]) => (
              <ImageInfoCard
                key={key}
                imageRef={imageRef}
                saveTime={saveTime}
                firebaseDocs={firebaseDocs}
              />
            ))}
          </Flex>
        ) : null}
      </ScrollArea>
    </Flex>
  );
};
export default Images;

type ImageInfoCardProps = {
  imageRef: ImageRefType;
  saveTime: boolean;
  firebaseDocs: Map<string, { id: string; data: ListingSchema }>;
};

const ImageInfoCard = ({
  imageRef,
  saveTime,
  firebaseDocs,
}: ImageInfoCardProps) => {
  const [url, setUrl] = useState("");
  const [variants, setVariants] = useState(imageRef.variants);

  useEffect(() => {
    const ref = imageRef.variants.at(-1);
    if (ref || !saveTime || ref!.metadata.size < 1_000_000) {
      getDownloadURL(ref!).then(setUrl);
    }
  }, []);

  const handleDelete = (ref: StorageReference, index: number) => {
    deleteObject(ref).then(() =>
      setVariants((prev) => prev.filter((_, i) => i !== index))
    );
  };

  return (
    <>
      <Divider label={imageRef.basename} />
      <Flex mb={32} align="flex-start" mr={18} gap={48}>
        <Image
          src={url}
          withPlaceholder
          height={120}
          width={200}
          placeholder={<IconPhotoOff />}
        />
        <Flex direction="column">
          <h3>{imageRef.co_owners.length > 0 ? "Used by:" : "NOT USED"}</h3>
          <Flex style={{ textAlign: "left" }} direction="column" gap={3}>
            {imageRef.co_owners.map((id) => (
              <Link key={id} href={`/admin/listings/${id}`}>
                <a style={{ color: "white" }}>
                  {firebaseDocs.get(id)?.data.title}
                </a>
              </Link>
            ))}
          </Flex>
        </Flex>
        <Flex direction="column">
          <h3>Variants</h3>
          {variants.length > 0 ? (
            <>
              {variants.map((variant, index) => (
                <ImageVariant
                  key={index}
                  index={index}
                  variant={variant}
                  handleDelete={handleDelete}
                />
              ))}
            </>
          ) : (
            <p>This item no longer exists</p>
          )}
        </Flex>
      </Flex>
    </>
  );
};

type ImageVariantProps = {
  index: number;
  variant: ImageCellType;
  handleDelete: (ref: StorageReference, index: number) => void;
};

const ImageVariant = ({ index, variant, handleDelete }: ImageVariantProps) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    getDownloadURL(variant).then(setUrl);
  }, []);

  return (
    <Flex justify="space-between" gap={16} align="center">
      <Text>
        {variant.sizeModifier.length === 0 ? "Full size" : variant.sizeModifier}
      </Text>
      <Text>
        {variant.metadata.size < 1000 * 1000
          ? Math.floor(variant.metadata.size / 1000) + " kb"
          : Math.floor(variant.metadata.size / 1_000_000) + " mb"}
      </Text>
      <Flex gap={6}>
        <ActionIcon onClick={() => handleDelete(variant, index)}>
          <IconTrash />
        </ActionIcon>
        <CopyButton value={url} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? "Copied" : "Copy"}
              withArrow
              position="right"
            >
              <ActionIcon onClick={copy}>
                {copied ? <IconCheck /> : <IconCopy />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Flex>
    </Flex>
  );
};

function sortIRCMap(
  [_, a]: [string, ImageRefType],
  [__, b]: [string, ImageRefType]
) {
  return (
    a.variants[0].metadata.updated.localeCompare(
      b.variants[0].metadata.updated
    ) * -1
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const querySnapshot = await getDocs(collection(db, "listings"));
  const firebaseDocs = querySnapshot.docs.map((listing) => ({
    id: listing.id,
    data: listing.data(),
  }));

  return {
    props: {
      firebaseDocs,
    },
  };
};
