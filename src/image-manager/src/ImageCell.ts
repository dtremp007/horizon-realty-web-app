import { getMetadata, StorageReference } from "firebase/storage";
import { ImageCellType } from "./types";

const SIZE_MODIFIERS = ["_1280x720", "_400x200"];

export async function createImageCell(
  ref: StorageReference
): Promise<ImageCellType> {
  const { sizeModifier, basename, ext } = siftOutSizeModifier(ref.name);
  (ref as ImageCellType).metadata = await getMetadata(ref);
  (ref as ImageCellType).sizeModifier = sizeModifier;
  (ref as ImageCellType).basename = basename;
  (ref as ImageCellType).ext = ext;
  return ref as ImageCellType;
}

export function siftOutSizeModifier(name: string) {
    const [basename, ext] = parseBaseName(name);
  for (const modifier of SIZE_MODIFIERS) {
    if (basename.includes(modifier)) {
      return { sizeModifier: modifier, basename: basename.replace(modifier, ""), ext };
    }
  }
  return { sizeModifier: "", basename, ext };
}

/**
 * Function takes basename and returns an array with basename and the file extension.
 */
function parseBaseName(baseName: string) {
  const ext = baseName.split(".").pop() || "unknown";
  return [baseName.replace("." + ext, ""), ext] as const;
}
