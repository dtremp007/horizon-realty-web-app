import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { DropzoneOptions } from "react-dropzone";
import {
  Grid,
  RingProgress,
  Image,
  ActionIcon,
  NativeSelect,
  Select,
  Modal,
  Button,
} from "@mantine/core";
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconArrowLeft,
  IconArrowRight,
  IconRotateClockwise,
} from "@tabler/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadMetadata,
  deleteObject,
  listAll,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../../../lib/firebase.config";
import process, { env } from "process";
import ImageSelectorModal from "./ImageSelectorModal";
import useDragAndDrop from "../../../hooks/useDragAndDrop";

type ImageUploaderProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

type UploaderImage = {
  id: string;
  url: string;
  uploaded: boolean;
  uploading: boolean;
  uploadProgress: number;
  error: boolean;
};

type UnsuccessulFile = {
  id: string;
  file: File;
};

const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
  const [images, setImages] = useState<UploaderImage[]>(
    value.map((url) => ({
      id: uuidv4(),
      url,
      uploaded: true,
      uploading: false,
      uploadProgress: 100,
      error: false,
    }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const unsuccessfullFiles = useRef<UnsuccessulFile[]>([]);

  const parent = useDragAndDrop((elements) => {
    console.log(images);
    const updatedImageList = elements
      .map((element) => {
        const id = element.id;
        if (!id) {
          return null;
        }
        const image = images.find((image) => image.id === id);
        return image;
      })
      .filter((image) => image !== null);

    setImages(updatedImageList as UploaderImage[]);
  }, value);

  useEffect(() => {
    onChange(
      images
        .filter((e) => e.uploaded === true && e.url !== null)
        .map((e) => {
          return e.url;
        })
    );
  }, [images]);

  /**
   * This function takes an image and uploads it to Firebase Storage. It returns a promise, when resolved,
   * gives you the download url.
   *
   * It also takes an id, which is used for updating the status of the image upload via `setImage`. It will set error
   * to true, if something goes wrong.
   *
   * TODO: give the ability to pause and resume an upload.
   */
  const storeImage = useCallback(async function storeImage(
    image: File,
    id: string
  ) {
    return new Promise<string>((resolve, reject) => {
      const fileName = image.name;
      const bucketPath = "images/";

      const storageRef = ref(storage, bucketPath + fileName);
      const metadata: UploadMetadata = { contentType: image.type };

      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setImages((prev) => {
            const updatedArray = [...prev];
            const index = updatedArray.findIndex((e) => e.id === id);
            const image = updatedArray[index];
            updatedArray.splice(index, 1, {
              ...image,
              uploadProgress: progress,
            });
            return updatedArray;
          });
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  },
  []);

  /**
   * An intermediary function that calls `storeImage` and handles errors.
   */
  const handleStoreImage = useCallback(
    async (image: File, id: string, localUrl: string) => {
      try {
        const url = await storeImage(image, id);
        setImages((prev) => {
          return replaceById(prev, id, {
            id,
            url,
            uploaded: true,
            uploading: false,
            uploadProgress: 100,
            error: false,
          });
        });
      } catch (error) {
        setImages((prev) => {
          console.log(error);
          return replaceById(prev, id, {
            id,
            url: localUrl,
            uploaded: false,
            uploading: false,
            uploadProgress: 0,
            error: true,
          });
        });
      }
    },
    []
  );

  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (acceptedFiles: File[]) => {
      const localUrls: UploaderImage[] = [];
      for (const file of acceptedFiles) {
        const id = uuidv4();
        unsuccessfullFiles.current.push({ id, file });
        const localUrl = URL.createObjectURL(file);

        localUrls.push({
          id,
          url: localUrl,
          uploaded: false,
          uploading: true,
          uploadProgress: 0,
          error: false,
        });

        handleStoreImage(file, id, localUrl);
      }

      setImages((prev) => prev.concat(localUrls));
    },
    []
  );

  const handleRetry = useCallback(
    (id: string) => {
      const file = unsuccessfullFiles.current.find((e) => e.id === id)
        ?.file as File;
      const localUrl = images.find((e) => e.id === id)?.url;
      handleStoreImage(file, id, localUrl as string);
    },
    [images]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const image = images.find((e) => e.id === id);
      if (image?.uploaded) {
        const imageRef = ref(storage, image.url);
        try {
          await deleteObject(imageRef);
        } catch (error) {
          console.log(error);
          //TODO: handle this error
        }
      }
      setImages((prev) => replaceById(prev, id));
    },
    [images]
  );

  const updateUrl = (id: string, url: string, action: "add" | "remove") => {
    if (action === "add") {
      setImages((prev) => {
          prev.push({
              id,
              url,
              uploaded: true,
              uploading: false,
              uploadProgress: 100,
              error: false,
            })
            return prev
        }
      );
    } else {
      const id = images.find((e) => e.url === url)?.id as string;
      setImages((prev) => replaceById(prev, id));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div className="image-uploader__container">
        <div className="image-uploader__grid" ref={parent}>
          {images.map((image, index) => (
            <ImagePreview
              key={image.id}
              image={image}
              id={image.id}
              handleRetry={handleRetry}
              handleDelete={handleDelete}
            />
          ))}

          <div className="image-uploader__add-image-box" {...getRootProps()}>
            <input {...getInputProps()} />
            <IconPhoto />
            Add Photo
          </div>
        </div>
      </div>
      <div className="image-uploader__button-container">
        <Button onClick={() => setModalOpen(true)}>Add From Database</Button>
      </div>
      <ImageSelectorModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedUrls={value}
        updateUrl={updateUrl}
      />
    </>
  );
};

type ImagePreviewProps = {
  image: UploaderImage;
  id: string;
  handleRetry: (id: string) => void;
  handleDelete: (id: string) => void;
};

const ImagePreview = ({
  image,
  id,
  handleRetry,
  handleDelete,
}: ImagePreviewProps) => {
  const thumbnail = useMemo(() => {
    if (image.uploaded && process.env.NODE_ENV !== "development") {
      const regexp = /(\.[^.]*?\?)/;
      return image.url.replace(regexp, "_1280x720.jpeg?");
    }
    return image.url;
  }, []);

  return (
    <div className="image-uploader__preview" id={id}>
      <Image src={thumbnail} height={144} />
      <div
        className="image-uploader__preview-overlay"
        style={{ backgroundColor: image.error ? "rgba(0,0,0,.4)" : "" }}
      >
        <ActionIcon
          style={{ alignSelf: "flex-end", zIndex: "100" }}
          onClick={() => handleDelete(image.id)}
        >
          <IconX />
        </ActionIcon>
        <ImageOverlay image={image} handleRetry={handleRetry} />
      </div>
    </div>
  );
};

type ImageOverlayProps = {
  image: UploaderImage;
  handleRetry: (id: string) => void;
};

const ImageOverlay = ({ image, handleRetry }: ImageOverlayProps) => {
  if (image.error) {
    return (
      <div>
        <span>Retry</span>
        <ActionIcon onClick={() => handleRetry(image.id)}>
          <IconRotateClockwise size={30} />
        </ActionIcon>
      </div>
    );
  }

  if (image.uploading) {
    return (
      <RingProgress
        sections={[{ value: image.uploadProgress, color: "blue" }]}
        className="image-uploader__ring-progress"
        size={50}
        thickness={5}
      />
    );
  }

  return <div className="image-uploader__preview-overlay"></div>;
};

export default ImageUploader;

/**
 * If you leave obj property undefined, the object will be removed.
 * @param arr - an array that has an id property
 * @param id - id of the arry
 * @param obj - (optional) object to replace old object
 * @returns - updated array
 */
export function replaceById<T extends { id: string }>(
  arr: Array<T>,
  id: string,
  obj?: T
) {
  arr = [...arr];
  const index = arr.findIndex((e) => e.id === id);
  if (index === -1) {
    console.log(
      "replaceById could not find the specified id. No changes were made to passed in function."
    );
    return arr;
  }

  if (typeof obj !== "undefined") {
    arr.splice(index, 1, obj);
    return arr;
  }

  if (arr.length === 1) {
    return [];
  }

  arr.splice(index, 1);
  return arr;
}

function deduceFilePath(url: string) {
  const result = RegExp(/(test|images)(?:%2F)([^?]*)/).exec(
    url
  ) as RegExpExecArray;
  return decodeURIComponent(result[0]);
}
