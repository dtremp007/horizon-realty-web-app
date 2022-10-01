import { GetServerSideProps, NextPage } from "next";
import { Card, Image, Text, Badge, Button, Group, Menu } from "@mantine/core";
import { useState } from "react";
import {
  getDocs,
  collection,
  DocumentData,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import Link from "next/link";
import { useRouter } from "next/router";
import { ListingSchema } from "../../../lib/interfaces/Listings";
type Props = {
  firebaseDocs: {
    id: string;
    data: ListingSchema;
  }[];
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

  function handleAddBtn() {
    const newDoc = doc(collection(db, "listings"));
    router.push(`/admin/listings/${newDoc.id}`);
  }

  if (!listings) {
    return <h1>No products</h1>;
  }

  return (
    <div style={{ margin: "0" }} className="listings__container">
      {listings.map((listing) => (
        <AdminListingCard key={listing.id} {...listing} />
      ))}
      <div className="admin-listings__add-listing" onClick={handleAddBtn}>
        <p>+</p>
      </div>
    </div>
  );
};
export default AdminListngs;

type AdminListingCardProps = {
  id: string;
  data: ListingSchema & { thumbnail?: string };
};

const AdminListingCard = (listing: AdminListingCardProps) => {
    const [availability, setAvailability] = useState(listing.data.availability)

  const handleAvailabilityChange = () => {
    const listingRef = doc(db, "listings", listing.id);
    updateDoc(listingRef, { availability: availability === "sold" ? "available" : "sold" });

    setAvailability(prev => prev === "sold" ? "available" : "sold")
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

    <Group direction="column" position="right">
      <Badge color={availability === "sold" ? "red" : "green"} variant="light">{availability === "sold" ? "Sold" : "Available"}</Badge>
      <Text weight={500}>{listing.data.title}</Text>
    </Group>

      <Group position="center" mt={16}>
        <Link href={`/admin/listings/${listing.id}`}>
          <Button color="blue" radius="md" style={{ width: "calc(50% - 8px" }}>
            Edit
          </Button>
        </Link>
        <Button
          color="green"
          radius="md"
          style={{ width: "calc(50% - 8px" }}
          onClick={handleAvailabilityChange}
        >
        {availability === "sold" ? "Mark as Available" : "Mark as Sold"}
        </Button>
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
