import { GetServerSideProps, NextPage } from "next";
import {
  Card,
  Text,
  Badge,
  Button,
  Flex,
  ScrollArea,
  ActionIcon,
  Center,
  Tabs,
  Indicator,
} from "@mantine/core";
import { useRef, useState } from "react";
import {
  getDocs,
  collection,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
  DocumentReference,
} from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import Link from "next/link";
import { useRouter } from "next/router";
import { ListingSchema } from "../../../lib/interfaces/Listings";
import { WebsiteMetadata } from "../filters";
import { IconTrash, IconEdit, IconCirclePlus } from "@tabler/icons";
import Image from "next/image";
import houseThumbnail from "../../../public/country-home-unsplash.jpg";

type Props = {
  firebaseDocs: {
    id: string;
    data: ListingSchema;
  }[];
  metadata: WebsiteMetadata;
};

const AdminListngs: NextPage<Props> = ({ firebaseDocs }) => {
  const [listings, setListings] = useState<Props["firebaseDocs"]>(
    firebaseDocs.map((listing) => {
      if (listing.data.imageUrls.length === 0) return listing;
      const regexp = /(\.[^.]*?\?)/;
      const thumbnail: string = listing.data.imageUrls[0].replace(
        regexp,
        "_1280x720.jpeg?"
      );
      return {
        id: listing.id,
        data: {
          ...listing.data,
          thumbnail,
        },
      };
    })
  );
  const router = useRouter();

  const removeListing = async (id: string) => {
    await deleteDoc(doc(db, "listings", id));

    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  function handleAddBtn() {
    const newDoc = doc(collection(db, "listings"));
    router.push(`/admin/listings/${newDoc.id}`);
  }

  function downloadObjectAsJson<T>(object: T, filename: string) {
    const json = JSON.stringify(object);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (!listings) {
    return <h1>No listings</h1>;
  }

  return (
    <>
      <Tabs defaultValue="available" pt={16}>
        <Tabs.List>
          <Tabs.Tab value="available" pr={32}>
            <Indicator
              label={
                <Text>
                  {
                    listings.filter((l) => l.data.listingType !== "VENDIDO")
                      .length
                  }
                </Text>
              }
              position="middle-end"
              size={18}
              offset={-16}
            >
              Available
            </Indicator>
          </Tabs.Tab>
          <Tabs.Tab value="sold" pr={32}>
            <Indicator
              label={
                <Text>
                  {
                    listings.filter((l) => l.data.listingType === "VENDIDO")
                      .length
                  }
                </Text>
              }
              position="middle-end"
              size={18}
              offset={-16}
              color="red"
            >
              Sold
            </Indicator>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="available">
          <ScrollArea style={{ height: "calc(100vh - 112px)" }}>
            <div style={{ margin: "1rem" }} className="listings__container">
              {listings
                .filter((l) => l.data.listingType !== "VENDIDO")
                .map((listing) => (
                  <AdminListingCard
                    key={listing.id}
                    listing={listing}
                    removeListing={removeListing}
                  />
                ))}
              <Center h={200}>
                <ActionIcon onClick={handleAddBtn} size="xl">
                  <IconCirclePlus size={48} />
                </ActionIcon>
              </Center>
            </div>
          </ScrollArea>
        </Tabs.Panel>
        <Tabs.Panel value="sold">
          <ScrollArea style={{ height: "calc(100vh - 112px)" }}>
            <div style={{ margin: "1rem" }} className="listings__container">
              {listings
                .filter((l) => l.data.listingType === "VENDIDO")
                .map((listing) => (
                  <AdminListingCard
                    key={listing.id}
                    listing={listing}
                    removeListing={removeListing}
                  />
                ))}
            </div>
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
      <div style={{ position: "fixed", bottom: 16, left: "350px" }}>
        <Button
          onClick={() =>
            downloadObjectAsJson(firebaseDocs, "horizon-listings.json")
          }
        >
          Download
        </Button>
      </div>
    </>
  );
};
export default AdminListngs;

type AdminListingCardProps = {
  listing: {
    id: string;
    data: ListingSchema & { thumbnail?: string };
  };
  removeListing: (id: string) => void;
};

const AdminListingCard = ({
  listing,
  removeListing,
}: AdminListingCardProps) => {
  const [availability, setAvailability] = useState(listing.data.availability);
  const [thumbnail, setThumbnail] = useState(listing.data.thumbnail!);
  const prevListingType = useRef(listing.data.listingType);

  const handleAvailabilityChange = () => {
    const listingRef = doc(
      db,
      "listings",
      listing.id
    ) as DocumentReference<ListingSchema>;
    updateDoc<ListingSchema>(listingRef, {
      availability: availability === "sold" ? "available" : "sold",
      listingType:
        availability === "sold" ? prevListingType.current : "VENDIDO",
    });

    setAvailability((prev) => (prev === "sold" ? "available" : "sold"));
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section
        style={{ height: "150px", position: "relative", overflow: "hidden" }}
      >
        <Image
          src={
            process.env.NODE_ENV === "development" ? houseThumbnail : thumbnail
          }
          height={160}
          layout="fill"
          objectFit="cover"
          alt="listing-thumbnail"
          onError={() => setThumbnail(listing.data.imageUrls[0])}
        />
      </Card.Section>

      <Flex direction="column" align="flex-end" mt={16}>
        <Badge
          color={availability === "sold" ? "red" : "green"}
          variant="light"
        >
          {availability === "sold" ? "Sold" : "Available"}
        </Badge>
        <Text weight={500}>{listing.data.title}</Text>
      </Flex>

      <Flex align="center" justify="flex-end" gap={16} mt={16}>
        <Link href={`/admin/listings/${listing.id}`}>
          <Button color="blue" radius="md">
            Edit
          </Button>
        </Link>
        <Button color="green" radius="md" onClick={handleAvailabilityChange}>
          {availability === "sold" ? "Mark as Available" : "Mark as Sold"}
        </Button>
        <ActionIcon onClick={() => removeListing(listing.id)}>
          <IconTrash />
        </ActionIcon>
      </Flex>
    </Card>
  );
};

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
