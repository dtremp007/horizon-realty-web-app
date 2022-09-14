import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css/bundle";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
  images: string[];
  title: string;
};

const CarouselContainer = ({ images, title }: Props) => {
  const thumbnails = useMemo(() => {
    return images.map((url) => {
      const regexp = /(\.[^.]*?\?)/;
      return url.replace(regexp, "_1280x720.jpeg?");
    });
  }, [images]);

  return (
    <Swiper
      navigation
      modules={[Navigation]}
      spaceBetween={0}
      slidesPerView={1}
      //   style={{maxWidth:"500px", color: "#fff"}}
    >
      {thumbnails.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="carousel__image-container">
            <Image src={image} layout="fill" objectFit="contain" alt={title} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselContainer;
