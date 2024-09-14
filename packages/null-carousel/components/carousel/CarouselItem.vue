<script setup lang="ts">
import {BEM} from "null-carousel/private-utils/bem"
import useCarouselItem from "./useCarousel"

const componentName = "carousel-item"
const bem = new BEM(componentName)
defineOptions({
  name: componentName,
})

const {activeIndex} = useCarouselItem()
</script>
<template>
  <div :class="[bem.bem()]">
    <slot name="default"></slot>
  </div>
</template>
<style lang="scss">
.#{bem("carousel-item")} {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
