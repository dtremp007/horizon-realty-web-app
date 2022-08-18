import { GetStaticProps, GetStaticPropsContext, NextPage } from "next";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import Show from "../../src/components/HOC/Show";
import { useContext, useEffect } from "react";
import NavigationContext from "../../src/context/navigationContext";
import ListingsContext from "../../src/context/listingsContext/listingsContext";
import Spinner from "../../src/shared/Spinner";
import { useRouter } from "next/router";
import {
  doc,
  DocumentData,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import ListingDetailLayout from "../../src/layouts/ListingDetailLayout";
import { ActionIcon } from "@mantine/core";
import { ParsedUrlQuery } from "querystring";

type Props = {
  data: DocumentData;
};

const DetailedPage: NextPage<Props> = ({ data }) => {
  const { state, dispatch } = useContext(NavigationContext);
  const {dispatch: listingsDispatch} = useContext(ListingsContext)
  const router = useRouter();

  useEffect(() => {
    dispatch({type: "BACK_BTN_ON", payload: router.query.id})

    return () => {
      dispatch({ type: "BACK_BTN_OFF" });
    };
  }, []);

  return (
    <>
      <ListingDetailLayout data={data} />
      <div className="detail-page__cta">
        <ActionIcon size="lg" onClick={() => console.log("Send email")}>
          <AiOutlineMail size={35} />
        </ActionIcon>
        <ActionIcon
          size="lg"
          onClick={() =>
            window.open(
              `https://wa.me/526251459646?text=${encodeURIComponent(
                "Hola, estoy escribiendo sobre " + data.title
              )}`,
              "_blank"
            )
          }
        >
          <FaWhatsapp size={32} />
        </ActionIcon>
      </div>
    </>
  );
};

export async function getStaticProps<GetStaticProps>(
  context: GetStaticPropsContext
) {
  const id = (context.params as ParsedUrlQuery).id as string;
  const docRef = doc(db, "listings", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return {
    props: {
      data,
    },
  };
}

export async function getStaticPaths() {
  const querySnapshot = await getDocs(collection(db, "listings"));
  // Get the paths we want to pre-render based on posts
  const paths = querySnapshot.docs.map((listing) => ({
    params: { id: listing.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default DetailedPage;
