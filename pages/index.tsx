import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@mantine/core";
import imgSrc from "../public/golden-horizon-logo.png";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mantine/hooks";
import DefaultButton from "../src/components/buttons/DefaultButton";
import { FaSearch, FaWhatsapp } from "react-icons/fa";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../lib/firebase.config";
import {QuerySnapshot, DocumentData} from "firebase/firestore"
import { GetServerSideProps } from "next";

const Home: NextPage = () => {
    const router = useRouter()

  return (
    <div className="landing-page__container">
      <div className="landing-page__logo-container">
        <Image priority={true} src={imgSrc} layout="responsive" alt="golden-horizon-logo"/>
      </div>
      <Button onClick={() => router.push("/listings")}>Ver Listados</Button>
    </div>
  );
};



export default Home;
