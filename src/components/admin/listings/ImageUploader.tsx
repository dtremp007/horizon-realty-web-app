import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DropzoneOptions } from "react-dropzone";
import { Grid, RingProgress } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import Image from "next/image";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {storage} from "../../../../lib/firebase.config"
import process from "process";

type ImageUploaderProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

type UploaderImages = {
  id: string;
  url: string;
  uploaded: boolean;
  uploading: boolean;
  uploadProgress: number;
  error: boolean;
}[];

const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
  const [images, setImages] = useState<UploaderImages>(
    value.map((url) => ({
      id: uuidv4(),
      url,
      uploaded: true,
      uploading: false,
      uploadProgress: 100,
      error: false,
    }))
  );

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
      const bucketPath = process.env.NODE_ENV === "development" ? "test/" : "images/"

      const storageRef = ref(storage, bucketPath + fileName);

      const uploadTask = uploadBytesResumable(storageRef, image);

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

  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (acceptedFiles: File[]) => {
      const localUrls: UploaderImages = [];
      for (const file of acceptedFiles) {
        const id = uuidv4();
        const localUrl = URL.createObjectURL(file);

        localUrls.push({
          id,
          url: localUrl,
          uploaded: false,
          uploading: true,
          uploadProgress: 0,
          error: false,
        });

        storeImage(file, id)
          .then((imageUrl) => {
            setImages((prev) => {
              const updatedArray = [...prev];

              //TODO: I'm sure you could make the following a little more readable with some abstraction

              const index = updatedArray.findIndex((e) => e.id === id);
              updatedArray.splice(index, 1, {
                id,
                url: imageUrl,
                uploaded: true,
                uploading: false,
                uploadProgress: 100,
                error: false,
              });

              onChange(updatedArray.filter(e => e.uploaded === true).map(e => e.url))

              return updatedArray;
            });
          })
          .catch((error) => {
            setImages((prev) => {
              console.log(error);

              const updatedArray = [...prev];
              const index = updatedArray.findIndex((e) => e.id === id);
              updatedArray.splice(index, 1, {
                id,
                url: localUrl,
                uploaded: false,
                uploading: false,
                uploadProgress: 0,
                error: true,
              });
              return updatedArray;
            });
          });
      }

      setImages((prev) => prev.concat(localUrls));
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="image-uploader__container" {...getRootProps()}>
      <input {...getInputProps()} />

      <div className="image-uploader__grid">
        {images.map((image) => (
          <div className="image-uploader__preview" key={image.id}>
            <Image src={image.url} layout="fill" objectFit="cover" />

            {image.uploading && (
              <div className="image-uploader__preview-overlay">
                <RingProgress
                  sections={[{ value: image.uploadProgress, color: "blue" }]}
                  className="image-uploader__ring-progress"
                  size={50}
                  thickness={5}
                />
              </div>
            )}
          </div>
        ))}

        <div className="image-uploader__add-image-box">
          <IconPhoto />
          Add Photo
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
