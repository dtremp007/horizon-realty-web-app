import { GetServerSideProps, NextPage } from "next";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Menu,
  ScrollArea,
  ActionIcon,
} from "@mantine/core";
import { useState } from "react";
import {
  getDocs,
  collection,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import Link from "next/link";
import { useRouter } from "next/router";
import { ListingSchema } from "../../../lib/interfaces/Listings";
import { WebsiteMetadata } from "../filters";
import { IconTrash, IconEdit, IconCirclePlus } from "@tabler/icons";

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
    await deleteDoc(doc(db, "listings", id))

    setListings(prev => prev.filter(l => l.id !== id))
  }

  function handleAddBtn() {
    const newDoc = doc(collection(db, "listings"));
    router.push(`/admin/listings/${newDoc.id}`);
  }

  if (!listings) {
    return <h1>No products</h1>;
  }

  return (
    <ScrollArea style={{height: "calc(100vh - 60px)"}}>
      <div style={{ margin: "1rem" }} className="listings__container">
        {listings.map((listing) => (
          <AdminListingCard key={listing.id} listing={listing} removeListing={removeListing}/>
        ))}
        <div className="admin-listings__add-listing" onClick={handleAddBtn}>
          <p>+</p>
        </div>
      </div>
    </ScrollArea>
  );
};
export default AdminListngs;

type AdminListingCardProps = {
    listing: {
  id: string;
  data: ListingSchema & { thumbnail?: string };
    },
    removeListing: (id: string) => void;
};

const AdminListingCard = ({listing, removeListing}: AdminListingCardProps) => {
  const [availability, setAvailability] = useState(listing.data.availability);

  const handleAvailabilityChange = () => {
    const listingRef = doc(db, "listings", listing.id);
    updateDoc(listingRef, {
      availability: availability === "sold" ? "available" : "sold",
    });

    setAvailability((prev) => (prev === "sold" ? "available" : "sold"));
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={listing.data.thumbnail}
          height={160}
          alt="listing-thumbnail"
        />
      </Card.Section>

      <Group direction="column" position="right" mt={16}>
        <Badge
          color={availability === "sold" ? "red" : "green"}
          variant="light"
        >
          {availability === "sold" ? "Sold" : "Available"}
        </Badge>
        <Text weight={500}>{listing.data.title}</Text>
      </Group>

      <Group position="center" mt={16}>
        <Link href={`/admin/listings/${listing.id}`}>
          <Button color="blue" radius="md">
            Edit
          </Button>
        </Link>
        <Button
          color="green"
          radius="md"
          onClick={handleAvailabilityChange}
        >
          {availability === "sold" ? "Mark as Available" : "Mark as Sold"}
        </Button>
        <ActionIcon onClick={() => removeListing(listing.id)}>
            <IconTrash/>
        </ActionIcon>
      </Group>
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
