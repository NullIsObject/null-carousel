<script setup lang="ts">
import {BEM} from "null-carousel/private-utils/bem"
import useCarouselItem from "./useCarouselItem"
import {computed} from "vue"

const componentName = "carousel-item"
const bem = new BEM(componentName)
defineOptions({
  name: componentName,
})

const {state} = useCarouselItem()
const isActive = computed(() => state.activeIndex === state.index)
// TODO
const isPrev = computed(() => state.activeIndex === state.index)
// TODO
const isNext = computed(() => state.activeIndex === state.index)
</script>
<template>
  <div :class="{
    [bem.bem()]: true,
    [bem.bem('','active')]: isActive,
    [bem.bem('','prev')]: isPrev,
    [bem.bem('','next')]: isNext,
  }">
    <slot name="default"></slot>
  </div>
</template>
<style lang="scss">
.#{root("carousel-item")} {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;

  &--active {
    z-index: 0;
  }
}
</style>
