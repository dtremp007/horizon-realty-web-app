import { GetServerSideProps, NextPage } from "next";
import ListingBuffet from "../src/components/filter_v2/ListingBuffet";
import path from "path";
import { readFileSync } from "fs";
import { FilterElement_V2_Props } from "../lib/interfaces/FilterTypes";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  Timestamp,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase.config";

type CategoryPageProps = {
  listingTypeFilter: FilterElement_V2_Props;
};

const CategoryPage: NextPage<CategoryPageProps> = ({ listingTypeFilter }) => {
  return (
    <div style={{ marginTop: "calc(60px + 1rem)" }}>
      <ListingBuffet listingTypeFilter={listingTypeFilter} />
    </div>
  );
};

export default CategoryPage;

export const getServerSideProps: GetServerSideProps = async () => {
//   const filtersFile = path.join(process.cwd(), "lib", "filters.json");
//   const listingTypeFilter = (
//     JSON.parse(readFileSync(filtersFile, { encoding: "utf8" })) as {
//       filters: FilterElement_V2_Props[];
//     }
//   ).filters.find((filter) => filter.id === "listingType");
    const querySnapshot = await getDocs(collection(db, "filters"));
    const listingTypeFilter = querySnapshot.docs.map((filter) => {
      return filter.data();
    }).find((filter) => filter.id === "listingType");


  return {
    props: {
      listingTypeFilter,
    },
  };
};
