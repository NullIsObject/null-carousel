<script setup lang="ts">
import {BEM} from "null-carousel/private-utils/bem"
import useCarouselItem from "./useCarouselItem"
import {computed, ref, unref, watch} from "vue"
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
const isPrimaryHorizontal = computed(() => state.animationType === ANIMATION_TYPE.PRIMARY_HORIZONTAL)
const isPrimaryVertical = computed(() => state.animationType === ANIMATION_TYPE.PRIMARY_VERTICAL)
const lastActiveIndex = ref(-1)
watch(() => state.activeIndex, (n, o) => lastActiveIndex.value = o ?? -1, {immediate: true})
const isAnimating = computed(() => unref(isActive) || unref(lastActiveIndex) === state.index)
</script>
<template>
  <div :class="{
    [bem.bem()]: true,
    [bem.bem('','active')]: isActive,
    [bem.bem('','prev')]: isPrev,
    [bem.bem('','next')]: isNext,
    [bem.bem('','primary-horizontal')]: isPrimaryHorizontal,
    [bem.bem('','primary-vertical')]: isPrimaryVertical,
    [bem.bem('','animating')]: isAnimating,

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
  z-index: 0;
  transform: translateX(0);

  &--animating {
    transition: transform .4s ease-in-out;
  }

  &--active {
    z-index: 1;
    transform: translateX(0);
  }

  &--prev {
    z-index: 1;
    --offset: -100%;
  }

  &--next {
    z-index: 1;
    --offset: 100%;
  }

  &--primary-horizontal {
    transform: translateX(var(--offset));
  }

  &--primary-vertical {
    transform: translateY(var(--offset));
  }
}
</style>
