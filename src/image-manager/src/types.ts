import { FullMetadata, StorageReference } from "firebase/storage";
import { ListingSchema } from "../../../lib/interfaces/Listings";

export interface ImageRefType {
    id: string;
    basename: string;
    variants: ImageCellType[];
    co_owners: string[];
}

export type ImageCellType = StorageReference & {
    /**
     * This is suffix that denotes that the image has been modified.
     * ```
     * imageCell.fullName = "image21_1280x720.jpeg"
     * imageCell.sizeModifier = "_1280x720"
     * ```
     * Empty if not present.
     */
    sizeModifier: string;
    /**
     * The image name without sizeModifier.
     */
    basename: string;
    metadata: FullMetadata;
}

export type Listing = {
   id: string;
   title: string;
   imageUrls: string[];
}

export type FirebaseDoc = {
    id: string;
    data: ListingSchema
}
