import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Button } from "@mantine/core";
import imgSrc from "../public/golden-horizon-logo-3d.png";
import { ref, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { storage } from "../lib/firebase.config";
import { useEffect, useRef, useState } from "react";

let initialLoad = false;

type HomeProps = {
  videoSrc: string;
};

const Home: NextPage<HomeProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  useEffect(() => {
    const countdown = new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 2200);
    });

    function play() {
      videoRef.current?.play();
    }

    function awaitVideo() {

        return new Promise(resolve => {
            function resolver() {
                resolve(1);
            }
            videoRef.current?.addEventListener("loadeddata", resolver)
        })
    }

    if (!initialLoad) {
      Promise.all([awaitVideo, countdown]).then(() => {
        setTimeout(() => {
          initialLoad = true;
        }, 500);
        setStyle({ transform: "translateY(-100vh)" });
        play();
      });
    } else {
      play();
    }

    videoRef.current?.addEventListener("ended", play);

    return () => {
      videoRef.current?.removeEventListener("ended", play);
    };
  }, []);

  return (
    <>
      <div className="landing-page__video-container">
        <video ref={videoRef} muted>
          <source src={videoSrc} />
        </video>
        <Link href="/listings">
          <a className="landing-page__link">Ver Listados</a>
        </Link>
      </div>
      {!initialLoad && (
        <div
          style={style}
          className="landing-page__logo-overlay"
          ref={overlayRef}
        >
          <div>
            <Image
              priority={true}
              src={imgSrc}
              layout="fill"
              objectFit="contain"
              alt="golden-horizon-logo"
            />
          </div>
        </div>
      )}
    </>
    // <div className="landing-page__container">
    //   <div className="landing-page__logo-container">
    //     <Image priority={true} src={imgSrc} layout="responsive" alt="golden-horizon-logo"/>
    //   </div>
    //     <a href="https://www.pond5.com/stock-footage/item/102337201-exterior-large-modern-white-home-tropical-hillside">Exterior Of A Large Modern White Home On A Tropical Hillside.</a> Footage by <a href="https://www.pond5.com/">Pond5</a>
    // </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === "development") {
    return {
      props: {
        videoSrc:
          "http://127.0.0.1:9199/v0/b/horizon-real-estate-30201.appspot.com/o/assets%2Flanding-page-video.mp4?alt=media&token=f0d097f6-d86a-406d-a241-1915ff062166",
      },
    };
  }
  const videoRef = ref(storage, "assets/landing-page-video.mp4");
  const videoSrc = await getDownloadURL(videoRef);

  return {
    props: {
      videoSrc,
    },
  };
};
