import { GetServerSidePropsContext, NextPage, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase.config";
import { doc, getDoc, collection, DocumentData } from "firebase/firestore";
import EditListing from "../../../src/components/admin/listings/EditListing";
import Spinner from "../../../src/shared/Spinner";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

type Props = {
  firebaseDoc: DocumentData;
};

const EditPage: NextPage<Props> = ({ firebaseDoc }) => {
  const [data, setData] = useState<DocumentData>(firebaseDoc);
  const router = useRouter();
  const id = router.query.id as string;

  return <EditListing id={id} data={data} mode="edit" />;
};
export default EditPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
    const id = (context.params as ParsedUrlQuery).id as string;
    const docRef = doc(db, "listings", id);
    const docSnap = await getDoc(docRef);
    const firebaseDoc = docSnap.data() || {};

    return {
      props: {
        firebaseDoc,
      },
    };
};
