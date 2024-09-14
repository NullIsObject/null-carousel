import _Carousel from "./Carousel.vue"
import _CarouselItem from "./CarouselItem.vue"
import {packComponent} from "null-carousel/private-utils/config"

const Carousel = packComponent(_Carousel)
const CarouselItem = packComponent(_CarouselItem)

export {
  Carousel,
  CarouselItem,
  Carousel as default
}
