export {};

export interface ListingSchema {
  address: string;
  id: number;
  listingType:
    | "LOTE"
    | "CASA"
    | "BODEGA"
    | "LOTES_COMERCIALES"
    | "LOTES_RESIDENCIALES"
    | "LABORES/RANCHOS"
    | "APARTMENTS"
    | "VENDIDO";
  price: number;
  bedrooms: number;
  bathrooms: number;
  coordinates: [number, number];
  currency: "USD" | "MXN";
  houseSize: number;
  houseSizeUnits: "SQ.FT.";
  electricity: boolean;
  landArea: number;
  landAreaUnits: "ACRES";
  description: string;
  imageUrls: string[];
  paymentType: string;
  availability: "sold" | "available" | "pending";
  title: string;
  water: boolean;
  status: {
    show: boolean;
    content: string;
    color: string;
  };
}

export type ListingFieldKey = keyof ListingSchema;

export type FirestoreDataTypes = "string" | "number" | "array" | "boolean";

export type ListingFieldOptions = {
  dataType: FirestoreDataTypes;
  options: "None" | string[];
  arrayDataType?: FirestoreDataTypes;
  filterIncompatible?: boolean;
};
