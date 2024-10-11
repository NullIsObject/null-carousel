import {Carousel, CarouselItem, ANIMATION_TYPE as _ANIMATION_TYPE} from "./carousel"

export * from "./icons"

namespace CarouselNS {
  export type ANIMATION_TYPE = _ANIMATION_TYPE
  export const ANIMATION_TYPE = _ANIMATION_TYPE
}

export {
  Carousel,
  CarouselItem,
  CarouselNS
}
