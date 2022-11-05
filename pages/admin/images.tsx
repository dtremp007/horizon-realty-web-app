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
  Switch,
  Text,
} from "@mantine/core";
import { ImageRefType } from "../../src/image-manager/src/types";
import { getSmallestVariant } from "../../src/image-manager/src/util";
import {
  deleteObject,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { IconPhotoOff, IconHome, IconTrash } from "@tabler/icons";
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

  const handleAnalyzer = useCallback(() => {
    analyzeDocs("images", firebaseDocs).then((map) => {
      setIRCMap(map);
    });
  }, []);

  return (
    <Group direction="column" m={16}>
      <Group>
        <h1 style={{ padding: "1rem" }}>Image Analyzer</h1>
        <Button onClick={handleAnalyzer}>Analyze</Button>
        <Switch
          checked={saveTime}
          onChange={(event) => setTimeSaver(event.currentTarget.checked)}
          label="Don't load heavy images"
        />
      </Group>
      <ScrollArea style={{ height: "calc(100vh - 180px)", width: "100%" }}>
        {IRCMap ? (
          <Group direction="column" grow style={{ width: "100%" }}>
            {[...IRCMap].sort(sortIRCMap).map(([key, imageRef]) => (
              <ImageInfoCard
                key={key}
                imageRef={imageRef}
                saveTime={saveTime}
                firebaseDocs={firebaseDocs}
              />
            ))}
          </Group>
        ) : null}
      </ScrollArea>
    </Group>
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
    const ref = getSmallestVariant(imageRef);
    if (!saveTime || ref.metadata.size < 1_000_000) {
      getDownloadURL(ref).then(setUrl);
    }
  }, []);

  const handleDelete = (ref: StorageReference, index: number) => {
    deleteObject(ref).then(() => setVariants(prev => prev.filter((_, i) => i !== index)));
  };

  return (
    <>
      <Divider label={imageRef.basename} />
      <Group mb={32} align="flex-start">
        <Image
          src={url}
          withPlaceholder
          height={120}
          width={200}
          placeholder={<IconPhotoOff />}
        />
        <Group direction="column">
          <h3>{imageRef.co_owners.length > 0 ? "Used by:" : "NOT USED"}</h3>
          <Group style={{ textAlign: "left" }} direction="column" spacing={3} >
            {imageRef.co_owners.map((id) => (
              <Link key={id} href={`/admin/listings/${id}`}><a style={{color: "white"}}>{firebaseDocs.get(id)?.data.title}</a></Link>
            ))}
          </Group>
        </Group>
        <Divider orientation="vertical" />
        <Group direction="column">
          <h3>Variants</h3>
          {variants.length > 0 ? (
            <>
          {variants.map((variant, index) => (
              <Group key={index}>
              <Text>
              {variant.sizeModifier.length === 0
                ? "Full size"
                : variant.sizeModifier}
                </Text>
                <Text>{variant.metadata.size < 1000 * 1000 ? Math.floor(variant.metadata.size / 1000) + " kb" : Math.floor(variant.metadata.size / (1_000_000)) + " mb"}</Text>
                <ActionIcon onClick={() => handleDelete(variant, index)}>
                <IconTrash />
              </ActionIcon>
            </Group>
            ))}
            </>
          ) : <p>This item no longer exists</p>
        }
        </Group>
      </Group>
    </>
  );
};

function sortIRCMap(
  [_, a]: [string, ImageRefType],
  [__, b]: [string, ImageRefType]
) {
  return a.variants[0].metadata.updated.localeCompare(
    b.variants[0].metadata.updated
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
