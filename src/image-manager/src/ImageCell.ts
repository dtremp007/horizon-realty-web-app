import { getMetadata, StorageReference } from "firebase/storage";
import { ImageCellType } from "./types";

const SIZE_MODIFIERS = ["_1280x720", "_400x200"];

export async function createImageCell(
  ref: StorageReference
): Promise<ImageCellType> {
  const { sizeModifier, basename } = siftOutSizeModifier(ref.name);
  (ref as ImageCellType).metadata = await getMetadata(ref);
  (ref as ImageCellType).sizeModifier = sizeModifier;
  (ref as ImageCellType).basename = basename;
  return ref as ImageCellType;
}

export function siftOutSizeModifier(name: string) {
  for (const modifier of SIZE_MODIFIERS) {
    if (name.includes(modifier)) {
      return { sizeModifier: modifier, basename: name.replace(modifier, "") };
    }
  }
  return { sizeModifier: "", basename: name };
}
