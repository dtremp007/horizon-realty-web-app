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
  Flex,
  Image,
  List,
  ScrollArea,
  Text,
  CopyButton,
  Tooltip,
  Menu,
  Switch,
  NumberInput,
  Select,
  Popover,
} from "@mantine/core";
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

const categories = [
  "ANY",
  "LOTE",
  "CASA",
  "BODEGA",
  "LOTES_COMERCIALES",
  "LOTES_RESIDENCIALES",
  "LABORES/RANCHOS",
  "APARTMENTS",
  "VENDIDO",
] as const;

const Images: NextPage<Props> = ({ firebaseDocs: docs }) => {
  const [firebaseDocs, setFirebaseDocs] = useState(
    new Map([...docs].map((doc) => [doc.id, doc]))
  );
  const [IRCMap, setIRCMap] = useState<Map<string, ImageRefType>>();
  const [dataSaverOn, setDataSaverOn] = useState(true);
  const [opened, setOpened] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [categoryFilter, setCategoryFilter] = useState("ANY");
  const [filteredIds, setFilteredIds] = useState(docs.map((doc) => doc.id));

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
          <Flex gap={8} align="center">
            <Popover opened={opened} onChange={setOpened} width="auto">
              <Popover.Target>
                <ActionIcon onClick={() => setOpened((o) => !o)}>
                  <IconDotsVertical />
                </ActionIcon>
              </Popover.Target>

              <Popover.Dropdown>
                <Flex direction="column" align="flex-start">
                  <Text>Settings</Text>
                  <Switch
                    checked={dataSaverOn}
                    onChange={(event) =>
                      setDataSaverOn(event.currentTarget.checked)
                    }
                    label="Data Saver"
                  />
                  <NumberInput
                    label="Show the most recent:"
                    value={pageSize}
                    onChange={(n) => setPageSize(n!)}
                  />
                  <Select
                    label="Filter by category"
                    value={categoryFilter}
                    data={categories as unknown as string[]}
                    onChange={(value) => {
                      setCategoryFilter(value as typeof categories[number]);
                      setFilteredIds(
                        docs
                          .filter((doc) =>
                            value === "ANY"
                              ? true
                              : doc.data.listingType === value
                          )
                          .map((doc) => doc.id)
                      );
                    }}
                  />
                </Flex>
              </Popover.Dropdown>
            </Popover>
            <Button onClick={handleAnalyzer}>Analyze</Button>
          </Flex>
          <Button>Save</Button>
        </Flex>
      </Flex>
      <ScrollArea style={{ height: "calc(100vh - 180px)", width: "100%" }}>
        {IRCMap ? (
          <Flex direction="column" style={{ width: "100%" }}>
            {[...IRCMap]
              .filter(filterIRCMap(filteredIds))
              .sort(sortIRCMap)
              .slice(0, pageSize)
              .map(([key, imageRef]) => (
                <ImageInfoCard
                  key={key}
                  imageRef={imageRef}
                  saveTime={dataSaverOn}
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
          caption={imageRef.isThumbnail ? "Thumbnail" : undefined}
        />
        <Flex direction="column">
          <h3>{imageRef.co_owners.length > 0 ? "Used by:" : "NOT USED"}</h3>
          <Flex style={{ textAlign: "left" }} direction="column" gap={3}>
            {imageRef.co_owners.map((id) => (
              <Link key={id} href={`/admin/listings/${id}`}>
                <a style={{ color: "white" }}>
                  {`${firebaseDocs.get(id)?.data.title}${
                    firebaseDocs.get(id)?.data.availability === "sold"
                      ? " (SOLD)"
                      : ""
                  }`}
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
        {`${
          variant.sizeModifier.length === 0 ? "Full size" : variant.sizeModifier
        }.${variant.ext}`}
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

function filterIRCMap(filteredIds: string[]) {
  return ([_, imageRef]: [string, ImageRefType]) =>
    imageRef.co_owners.some((id) => filteredIds.includes(id));
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
