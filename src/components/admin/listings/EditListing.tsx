import {
  TextInput,
  Checkbox,
  Button,
  Box,
  Accordion,
  NumberInput,
  Select,
  Paper,
  Space,
  ActionIcon,
  Text,
  ScrollArea,
  Flex
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DocumentData, query, setDoc } from "firebase/firestore";
import ImageUploader from "./ImageUploader";
import Tiptap from "./Tiptap";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase.config";
import { IconArrowLeft, IconCheck } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as R from "rambda";
import { WebsiteMetadata } from "../../../../pages/admin/filters";
import EditJsonModal from "../filters/EditJsonModal";

type ListingData = {
  address: string;
  coordinates: string | string[];
  currency: "USD" | "MXN";
  description: string;
  imageUrls: string[];
  landArea: number;
  landAreaUnits: string;
  houseSize: number;
  houseSizeUnits: string;
  listingType: string;
  paymentType: string;
  price: number;
  title: string;
  bathrooms: number;
  bedrooms: number;
  water: boolean;
  electricity: boolean;
};

type EditListingProps = {
  id?: string;
  data?: DocumentData;
  mode: "edit" | "new";
  metadata: WebsiteMetadata;
};

const EditListing = ({ id, data, mode, metadata: md }: EditListingProps) => {
  const [uploaded, setUploaded] = useState(!R.isEmpty(data));
  const [metadata, setMetadata] = useState(md);
  const defaultPropertyValues: ListingData = {
    address: "",
    coordinates: [],
    currency: "USD",
    description: "Description",
    imageUrls: [],
    landArea: 0,
    landAreaUnits: "ACRES",
    houseSize: 0,
    houseSizeUnits: "SQ.FT.",
    listingType: "",
    paymentType: "",
    price: 1000,
    title: "",
    bathrooms: 0,
    bedrooms: 0,
    water: false,
    electricity: false,
  };

  const form = useForm({
    initialValues: R.mergeAll([defaultPropertyValues, data as ListingData]),
  });

  useEffect(() => {
    if (form.isDirty()) {
      setUploaded(false);
    }
  }, [form.isDirty()]);

  async function handleSubmit(values: undefined) {
    await setDoc(doc(db, "listings", id as string), values);
    setUploaded(true);
    form.resetDirty();
  }

  return (
    <ScrollArea type="auto" style={{height: "calc(100vh - 60px)"}}>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ margin: "1rem 3rem" }}
      >
        <Flex justify="space-between" mb={18}>
          <Link href="/admin/listings">
            <ActionIcon>
              <IconArrowLeft />
            </ActionIcon>
          </Link>
          <Flex gap={18} align="center">
            {uploaded && <IconCheck />}
            <Button disabled={!form.isDirty()} type="submit">
              Save
            </Button>
            <Link href={`/listings/${id}`}>
              <Button disabled={!uploaded}>View Listing</Button>
            </Link>
          </Flex>
        </Flex>
        <TextInput
          style={{ marginLeft: ".75rem" }}
          variant="unstyled"
          placeholder="Listing Title"
          size="xl"
          {...form.getInputProps("title")}
        />
        <Accordion style={{ textAlign: "left" }}>
          <Accordion.Item value="details">
            <Accordion.Control>Details</Accordion.Control>
            <Accordion.Panel>
            <Select
              label="Type"
              data={metadata.listings.fields.listingType.options}
              searchable
              placeholder="Listing type"
              {...form.getInputProps("listingType")}
            />
            <Flex>
              <NumberInput
                label="Price"
                defaultValue={5000}
                step={100}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value || "0"))
                    ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : "$ "
                }
                {...form.getInputProps("price")}
              />
              <Select
                label="Currency"
                placeholder="Pick one"
                data={[
                  { value: "USD", label: "USD" },
                  { value: "MXN", label: "MXN" },
                ]}
                {...form.getInputProps("currency")}
              />
              <TextInput
                type="text"
                label="Payment Type"
                {...form.getInputProps("paymentType")}
              />
            </Flex>
            <Flex>
              <TextInput
                type="number"
                label="Lot Size"
                {...form.getInputProps("landArea")}
              />
              <Select
                label="Units"
                placeholder="Pick one"
                data={["ACRES", "HECTARES"]}
                {...form.getInputProps("landAreaUnits")}
              />
            </Flex>
            <Flex>
              <TextInput
                type="number"
                label="House Size"
                {...form.getInputProps("houseSize")}
              />
              <Select
                label="Units"
                placeholder="Pick one"
                data={["SQ.FT."]}
                {...form.getInputProps("houseSizeUnits")}
              />
            </Flex>
            <TextInput
              type="text"
              label="Address"
              {...form.getInputProps("address")}
            />
            <CoordinatesInput {...form.getInputProps("coordinates")} />
            <Flex>
              <NumberInput
                label="Bathrooms"
                step={1}
                {...form.getInputProps("bathrooms")}
              />
              <NumberInput
                label="Bedrooms"
                step={1}
                {...form.getInputProps("bedrooms")}
              />
            </Flex>
            <Space h="lg" />
            <Flex direction="column">
              <Text>Ulitities</Text>
              <Checkbox
                label="Water"
                value="water"
                {...form.getInputProps("water", { type: "checkbox" })}
              />
              <Checkbox
                label="Electricity"
                value="electricity"
                {...form.getInputProps("electricity", { type: "checkbox" })}
              />
            </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Space h="md" />
        <Paper p="md">
          <Tiptap {...form.getInputProps("description")} />
        </Paper>
        <Space h="md" />
        <ImageUploader {...form.getInputProps("imageUrls")} />
        <EditJsonModal onClose={(values) => {form.setValues(values); setUploaded(false)}} form={form} />
      </form>
    </ScrollArea>
  );
};
export default EditListing;

type CoordinatesInputProps = {
  value: any;
  onChange: (e: any) => void;
};

const CoordinatesInput = ({ value, onChange }: CoordinatesInputProps) => {
  function handleChange(e: any) {
    const parsedCoordinates = e.target.value
      .split(",")
      .map((e: any) => parseFloat(e.trim()));
    onChange(parsedCoordinates);
  }

  return (
    <Flex align="flex-end">
      <TextInput type="text" label="Coordinates" onChange={handleChange} />
      <div
        style={{
          border: "1px solid gray",
          borderRadius: "3px",
          padding: "7px 10px",
          textTransform: "uppercase",
          fontSize: ".75rem",
        }}
      >{`Latitude: ${value[0]}, Longitude: ${value[1]}`}</div>
    </Flex>
  );
};
