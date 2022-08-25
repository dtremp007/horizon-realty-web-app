import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Accordion,
  AccordionItem,
  NumberInput,
  Select,
  Paper,
  Space,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DocumentData, setDoc } from "firebase/firestore";
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
import { useState } from "react";

type ListingData = {
  address: string;
  coordinates: string | string[];
  currency: "USD" | "MXN";
  description: string;
  imageUrls: string[];
  landArea: number;
  landAreaUnits: string;
  listingType: string;
  paymentType: string;
  price: number;
  title: string;
};

type EditListingProps = {
  id?: string;
  data?: DocumentData;
  mode: "edit" | "new";
};

const EditListing = ({ id, data, mode }: EditListingProps) => {
  const [uploaded, setUploaded] = useState(false);
  const initialValues: ListingData =
    data !== null
      ? (data as ListingData)
      : {
          address: "",
          coordinates: [],
          currency: "USD",
          description: "Description",
          imageUrls: [],
          landArea: 0,
          landAreaUnits: "",
          listingType: "",
          paymentType: "",
          price: 1000,
          title: "",
        };
  const form = useForm({
    initialValues,
  });

  async function handleSubmit(values: ListingData) {
    await setDoc(doc(db, "listings", id as string), form.values);
    setUploaded(true);
  }

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      style={{ margin: "1rem 3rem" }}
    >
      <Group position="apart" mb={18}>
        <Link href="/admin/listings">
          <ActionIcon>
            <IconArrowLeft />
          </ActionIcon>
        </Link>
        <Group>
            {uploaded && <IconCheck/>}
          <Button disabled={!form.isDirty()} type="submit">
            Save
          </Button>
        </Group>
      </Group>
      <TextInput
        style={{ marginLeft: ".75rem" }}
        variant="unstyled"
        placeholder="Listing Title"
        size="xl"
        {...form.getInputProps("title")}
      />
      <Accordion style={{ textAlign: "left" }} iconPosition="right">
        <AccordionItem label={<p>Details</p>}>
          <Select
            label="Type"
            data={["LOTE", "CASA"]}
            searchable
            placeholder="Listing type"
            {...form.getInputProps("listingType")}
          />
          <Group>
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
          </Group>
          <Group>
            <TextInput
              type="number"
              label="Lot Size"
              {...form.getInputProps("landArea")}
            />
            <Select
              label="Units"
              placeholder="Pick one"
              data={["ACRES"]}
              {...form.getInputProps("landAreaUnits")}
            />
          </Group>
          <TextInput
            type="text"
            label="Address"
            {...form.getInputProps("address")}
          />
          <CoordinatesInput {...form.getInputProps("coordinates")} />
        </AccordionItem>
      </Accordion>
      <Space h="md" />
      <Paper p="md">
        <Tiptap {...form.getInputProps("description")} />
      </Paper>
      <Space h="md" />
      <ImageUploader {...form.getInputProps("imageUrls")} />
    </form>
  );
};
export default EditListing;

type CoordinatesInputProps = {
  onChange: (e: any) => void;
};

const CoordinatesInput = ({ onChange }: CoordinatesInputProps) => {
  function handleChange(e: any) {
    const parsedCoordinates = e.target.value
      .split(",")
      .map((e: any) => parseFloat(e.trim()));
    onChange(parsedCoordinates);
  }

  return <TextInput type="text" label="Coordinates" onChange={handleChange} />;
};
