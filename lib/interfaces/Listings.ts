export{}

export interface ListingSchema {
    id: number,
    timestamp: Date,
    user: string,
    type: "Home" | "Building Lot" | "Farm Land" | "Rent",
    price: number,
    currency: "USD" | "MXN",
    bedrooms: number,
    bathrooms: number,
    area: string,
    furnished: boolean,
    lawn: boolean,
    trees: boolean,
    utilities: Array<string> | "none",
    location: string,
    geolocation: string,
    streetAddress: string,
    description: string,
    yearBuilt: number,
    imageUrls: Array<string>,
}

export interface SampleListing {
    id: number,
    name: string,
    price: number,
    geolocation: number[]
}
