<script setup lang="ts">
import {BEM} from "null-carousel/private-utils/bem"
import useCarouselItem from "./useCarouselItem"
import {computed} from "vue"
import {ANIMATION_TYPE} from "./utils"

const componentName = "carousel-item"
const bem = new BEM(componentName)
defineOptions({
  name: componentName,
})

const {state} = useCarouselItem()
const isActive = computed(() => state.activeIndex === state.index)
const isPrev = computed(() => {
  if (state.activeIndex === 0) return state.loop && state.index === state.maxIndex
  return state.activeIndex - 1 === state.index
})
const isNext = computed(() => {
  if (state.activeIndex === state.maxIndex) return state.loop && state.index === 0
  return state.activeIndex + 1 === state.index
})
const isPrimaryHorizontal = computed(() => state.animationType === ANIMATION_TYPE.PRIMARY_HORIZONTAL && state.maxIndex >= 2)
</script>
<template>
  <div :class="{
    [bem.bem()]: true,
    [bem.bem('','active')]: isActive,
    [bem.bem('','prev')]: isPrev,
    [bem.bem('','next')]: isNext,
    [bem.bem('','primary-horizontal')]: isPrimaryHorizontal,
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
  // TODO
  transition: .8s;

  &--active {
    z-index: 0;
    transform: translateX(0);
  }

  &--prev,
  &--primary-horizontal {
    transform: translateX(-100%);
  }

  &--next,
  &--primary-horizontal {
    transform: translateX(100%);
  }
}
</style>
