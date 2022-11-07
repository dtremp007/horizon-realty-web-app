import {
  getStorage,
  list,
  listAll,
  ListResult,
  ref,
  StorageReference,
} from "firebase/storage";
import { createImageCell, siftOutSizeModifier } from "./ImageCell";
import { FirebaseDoc, ImageCellType, ImageRefType } from "./types";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../../lib/firebase.config";

async function parseStorageItems(
  items: ListResult["items"]
): Promise<ImageCellType[]> {
  return Promise.all(items.map(async (item) => await createImageCell(item)));
}

function groupImages(images: ImageCellType[], map: Map<string, ImageRefType>) {
  for (const image of images) {
    if (map.has(image.basename)) {
      map.get(image.basename)?.variants.push(image);
    } else {
      map.set(image.basename, {
        id: uuidv4(),
        basename: image.basename,
        variants: [image],
        co_owners: [],
      });
    }
  }
  return map;
}

/**
 * This function is very impure and I'm not proud of it.
 */
async function recursivelyParseStorageList(
  list: ListResult,
  map: Map<string, ImageRefType>
) {
  if (list.prefixes.length > 0) {
    for (const folder of list.prefixes) {
      await recursivelyParseStorageList(await listAll(folder), map);
    }
  }

  if (list.items.length > 0) {
    groupImages(await parseStorageItems(list.items), map);
  }

  return map;
}

async function createImageRefMap(path: string) {
  const listRef = ref(storage, path);
  return await recursivelyParseStorageList(await listAll(listRef), new Map());
}

function findImageOwners(
  firebaseDocs: Map<string, FirebaseDoc>,
  refMap: Map<string, ImageRefType>
) {
  for (const [id, doc] of firebaseDocs) {
    for (const url of doc.data.imageUrls) {
      const imageRef = ref(storage, url);
      const { basename, sizeModifier } = siftOutSizeModifier(imageRef.name);
      if (refMap.has(basename)) {
        refMap.get(basename)!.co_owners.push(id);
      }
    }
  }
  return refMap;
}

/**
 *
 * @param path - path to the folder you want to analyze
 * @param firebaseDocs - a Map of all listing docs
 * @returns a Map of all the base images and it's variants. Varians a sorted biggest to smallest.
 */
export default async function analyzeDocs(
  path: string,
  firebaseDocs: Map<string, FirebaseDoc>
) {
  const refMap = findImageOwners(firebaseDocs, await createImageRefMap(path));
  for (const [id, ref] of refMap) {
    ref.variants.sort((a, b) => (a.metadata.size - b.metadata.size) * -1);
  }
  return refMap;
}
