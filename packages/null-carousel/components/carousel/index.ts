import _Carousel from "./carousel.vue"
import _CarouselItem from "./carousel-item.vue"
import {packComponent} from "null-carousel/private-utils/config"

const Carousel = packComponent(_Carousel)
const CarouselItem = packComponent(_CarouselItem)

export {
  Carousel,
  CarouselItem,
  Carousel as default
}
