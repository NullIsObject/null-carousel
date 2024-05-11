import _Carousel     from "./carousel.vue"
import _CarouselItem  from "./carousel-item.vue"
import packComponent from "@null-carousel/packages/private-utils/pack-component"

export const Carousel = packComponent("carousel", _Carousel)
export const CarouselItem = packComponent("carousel-item", _CarouselItem)

export {
  Carousel as default
}
