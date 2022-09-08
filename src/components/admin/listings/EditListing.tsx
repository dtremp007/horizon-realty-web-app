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
  CheckboxGroup,
  Text,
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
import { useEffect, useState } from "react";
import * as R from "rambda";

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
  bathrooms: number;
  bedrooms: number;
  water: boolean;
  electricity: boolean;
};

type EditListingProps = {
  id?: string;
  data?: DocumentData;
  mode: "edit" | "new";
};

const EditListing = ({ id, data, mode }: EditListingProps) => {
  const [uploaded, setUploaded] = useState(false);
  const defaultPropertyValues = {
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
        setUploaded(false)
    }
  }, [form.isDirty()])

  async function handleSubmit(values: undefined) {
    await setDoc(doc(db, "listings", id as string), values);
    setUploaded(true);
    form.resetDirty();
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
          {uploaded && <IconCheck />}
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
            <TextInput
              type="text"
              label="Payment Type"
              {...form.getInputProps("paymentType")}
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
          <Group>
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
          </Group>
          <Space h="lg" />
          {/* I tried using CheckboxGroup, but it made form.getInputProps not work right, but thinking abount it, I probably should have used the function inside the Group tag. */}
          <Group direction="column">
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
          </Group>
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
    <Group align="flex-end">
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
    </Group>
  );
};
