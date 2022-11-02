import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css/bundle";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

const CarouselContainer = ({ images, title }: Props) => {
  const thumbnails = useMemo(() => {
    return images.map((url) => {
      const regexp = /(\.[^.]*?\?)/;
      return {
        backup: url,
        thumbnail: url.replace(regexp, "_1280x720.jpeg?"),
      };
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
          <ImageContainer title={title} image={image} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

type ImageContainerProps = {
  image: {
    backup: string;
    thumbnail: string;
  };
  title: string;
};

const ImageContainer = ({ image, title }: ImageContainerProps) => {
  const [thumbnail, setThumbnail] = useState(image.thumbnail);

  return (
    <div className="carousel__image-container">
      <Image
        src={thumbnail}
        onError={() => setThumbnail(image.backup)}
        layout="fill"
        objectFit="contain"
        alt={title}
      />
    </div>
  );
};

export default CarouselContainer;
