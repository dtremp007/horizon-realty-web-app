import { GetServerSidePropsContext, NextPage, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase.config";
import { doc, getDoc, collection, DocumentData } from "firebase/firestore";
import EditListing from "../../../src/components/admin/listings/EditListing";
import Spinner from "../../../src/shared/Spinner";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { readFileSync } from "fs";
import path from "path";
import { WebsiteMetadata } from "../filters";
import { ListingSchema } from "../../../lib/interfaces/Listings";

type Props = {
  firebaseDoc: DocumentData;
  metadata: WebsiteMetadata;
};

const EditPage: NextPage<Props> = ({ firebaseDoc, metadata }) => {
  const [data, setData] = useState<DocumentData>(firebaseDoc);
  const router = useRouter();
  const id = router.query.id as string;

  return <EditListing id={id} data={data as any} mode="edit" metadata={metadata} />;
};
export default EditPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = (context.params as ParsedUrlQuery).id as string;
  const docRef = doc(db, "listings", id);
  const docSnap = await getDoc(docRef);
  const firebaseDoc = docSnap.data() || {};
  const metadataFile = path.join(process.cwd(), "lib", "metadata.json");
  const metadata = JSON.parse(readFileSync(metadataFile, { encoding: "utf8" }));

  return {
    props: {
      firebaseDoc,
      metadata,
    },
  };
};
