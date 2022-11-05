import { ImageRefType } from "./types";

export function getSmallestVariant(ref: ImageRefType) {
  return ref.variants.reduce(
    (prev, curr) => (prev.metadata.size > curr.metadata.size ? curr : prev),
    ref.variants[0]
  );
}
