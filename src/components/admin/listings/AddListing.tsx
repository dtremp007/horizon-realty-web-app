import { db } from "../../../../lib/firebase.config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Radio, Textarea, TextInput, Button } from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Show from "../../HOC/Show";
import Tiptap from "./Tiptap";
import { EditorEvents } from '@tiptap/react'

type FormDataState = {
  title: string;
  listingType: string;
  price: number;
  currency: string;
  paymentType: string;
  landArea: number;
  landAreaUnits: string;
  address: string;
  coordinates: string | number[];
  description: string;
  images: FileList | null;
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type SubmitData = Optional<FormDataState, "images"> & {
  imageUrls: string[] | void;
};

const AddListing = () => {
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    listingType: "",
    price: 0,
    currency: "USD",
    paymentType: "",
    landArea: 0,
    landAreaUnits: "",
    address: "",
    coordinates: "",
    description: "",
    images: null,
  });

  const [uploaded, setUploaded] = useState(false);

  const {
    title,
    listingType,
    price,
    currency,
    paymentType,
    landArea,
    landAreaUnits,
    address,
    coordinates,
    description,
    images,
  } = formData;

  useEffect(() => {
    if (uploaded) {
      setTimeout(() => {
        setUploaded(false);
      }, 1000);
    }
  }, [uploaded]);

  const handleDescription = ({editor}: EditorEvents["update"]) => {
    setFormData((prevState) => ({
        ...prevState,
        description: editor.getHTML()
    }))
  }

  const handleChange = (e: any) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.valueAsNumber || e.target.value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Store image in firebase
    const storeImage = async (image: File) => {
      return new Promise<string>((resolve, reject) => {
        const storage = getStorage();
        const fileName = image.name;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
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
    };

    const imagesList = Array.from(images as FileList);
    console.log(imagesList);

    const imageUrls = await Promise.all(
      imagesList.map((image) => storeImage(image))
    ).catch(() => {
      alert("Could not upload images");
      return;
    });

    const formDataCopy: SubmitData = {
      ...formData,
      imageUrls,
      coordinates: (coordinates as string).split(",").map((e) => parseFloat(e.trim())),
    };

    delete formDataCopy.images;

    console.log(formDataCopy);

    try {
      await addDoc(collection(db, "listings"), formDataCopy);
      console.log("success");
    } catch (error) {
      alert(error);
    }

    setFormData({
      title: "",
      listingType: "",
      price: 0,
      currency: "USD",
      paymentType,
      landArea: 0,
      landAreaUnits: "",
      address: "",
      coordinates: "",
      description: "",
      images: null,
    });

    setUploaded(true);
  };

  return (
    <Show when={!uploaded} alt={<h1>Success</h1>}>
      <div className="add-listing__container">
        <form onSubmit={handleSubmit}>
          <div className="add-listing__action-items">
            <Button type="submit">Save Listing</Button>
          </div>
          <div className="add-listing__form-container">
          <div className="add-listing__rte">
            <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={handleChange}
              />

              <label>Description</label>
              <Tiptap onUpdate={handleDescription} />
            </div>
            <div className="add-listing__details">


              <label htmlFor="listingType">Listing Type</label>
              <input
                type="text"
                name="listingType"
                id="listingType"
                value={listingType}
                onChange={handleChange}
              />

              <label htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={handleChange}
              />

              <label htmlFor="currency">Currency</label>
              <input
                type="text"
                name="currency"
                id="currency"
                value={currency}
                onChange={handleChange}
              />

              <label htmlFor="paymentType">Payment Type</label>
              <input
                type="text"
                name="paymentType"
                id="paymentType"
                value={paymentType}
                onChange={handleChange}
              />

              <label htmlFor="landArea">Lot Size</label>
              <input
                type="number"
                name="landArea"
                id="landArea"
                value={landArea}
                onChange={handleChange}
              />

              <label htmlFor="landAreaUnits">Lot Size Units</label>
              <input
                type="text"
                name="landAreaUnits"
                id="landAreaUnits"
                value={landAreaUnits}
                placeholder="acres, sq.ft. etc"
                onChange={handleChange}
              />

              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={handleChange}
              />

              <label htmlFor="coordinates">Coordinates</label>
              <input
                type="text"
                name="coordinates"
                id="coordinates"
                value={coordinates as string}
                onChange={handleChange}
              />
              <label>Images</label>
              <input
                type="file"
                id="images"
                onChange={handleChange}
                max="6"
                accept=".jpg,.png,.jpeg"
                multiple
                required
              />
            </div>
          </div>
        </form>
      </div>
    </Show>
  );
};
export default AddListing;