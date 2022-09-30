import { NextPage, GetServerSideProps } from "next";
import path from "path";
import { readFileSync } from "fs";
import { FilterElement_V2_Props } from "../../lib/interfaces/FilterTypes";
import { WebsiteMetadata } from "./filters";

type SettingsPageProps = {
  filters: FilterElement_V2_Props[];
  metadata: WebsiteMetadata;
};

const SettingsPage: NextPage<SettingsPageProps> = ({filters, metadata}) => {
    return (
        <p>
            {JSON.stringify(metadata)}
        </p>
    )
}

export default SettingsPage

export const getServerSideProps: GetServerSideProps = async () => {
  const filtersFile = path.join(process.cwd(), "lib", "filters.json");
  const metadataFile = path.join(process.cwd(), "lib", "metadata.json");
  const filters = JSON.parse(
    readFileSync(filtersFile, { encoding: "utf8" }) // I removed .toString(), I'm not sure why it was here. I don't think it's necessary.
  ).filters;
  const metadata = JSON.parse(readFileSync(metadataFile, { encoding: "utf8" }));

  return {
    props: {
      filters,
      metadata,
    },
  };
};
