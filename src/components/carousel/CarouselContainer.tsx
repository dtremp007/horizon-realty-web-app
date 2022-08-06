import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css/bundle";
import { StaticImageData } from "next/image";
import Image from "next/image";

type Props = {
  images: StaticImageData[];
};

const CarouselContainer = ({ images }: Props) => {

  return (
    <Swiper
      navigation
      modules={[Navigation]}
      spaceBetween={0}
      slidesPerView={1}
    //   style={{maxWidth:"500px", color: "#fff"}}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index} >
          <div className="carousel__image-container">
            <Image src={image} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselContainer;
