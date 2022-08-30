import { NextPage } from "next";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import houseImage from "../public/country-home-unsplash.jpg";

const Home: NextPage = () => {
  const [emblaRef] = useEmblaCarousel();

  return (
    <div className="home-page__embla" ref={emblaRef}>
      <div className="home-page__embla-container">
        {[1, 2, 3].map((num) => (
          <div className="home-page__embla-slide" key={num}>
            <Image src={houseImage} layout="fill" objectFit="cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
