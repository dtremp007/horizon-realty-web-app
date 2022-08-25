import { GetServerSideProps, NextPage } from "next";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { getDocs, collection, DocumentData, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import Spinner from "../../../src/shared/Spinner";
import Link from "next/link"
import { useRouter } from "next/router";
type Props = {
  firebaseDocs: {
    id: string;
    data: DocumentData;
  }[];
};

const AdminListngs: NextPage<Props> = ({ firebaseDocs }) => {
  const [listings, setListings] = useState(firebaseDocs);
  const router = useRouter()

  function handleAddBtn() {
    const newDoc = doc(collection(db, "listings"))
    router.push(`/admin/listings/${newDoc.id}`);
  }

  if (!listings) {
    return <h1>No products</h1>;
  }

  return (
    <div style={{ margin: "0" }} className="listings__container">
      {listings.map((listing) => (
        <Card key={listing.id} shadow="sm" p="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src={listing.data.imageUrls[0]}
              height={160}
              alt="listing-thumbnail"
            />
          </Card.Section>

            <Text weight={500}>{listing.data.title}</Text>

          <Group position="center" mt={16}>
            <Link href={`/admin/listings/${listing.id}`}>
            <Button color="blue" radius="md" style={{width: "calc(50% - 8px"}}>
              Edit
            </Button>
            </Link>
            <Button color="green" radius="md" style={{width: "calc(50% - 8px"}}>
             Mark as Sold
            </Button>
          </Group>
        </Card>
      ))}
      <div className="admin-listings__add-listing" onClick={handleAddBtn}><p>+</p></div>
    </div>
  );
};
export default AdminListngs;

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
