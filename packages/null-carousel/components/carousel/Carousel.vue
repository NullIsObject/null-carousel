<script setup lang="ts">
import {computed, CSSProperties} from "vue"
import useCarousel, {Props} from "./useCarousel"
import {BEM} from "null-carousel/private-utils/bem"
import TrilateralIcon from "null-carousel/components/icons/icon-trilateral"
import {ANIMATION_TYPE} from "./utils"

const componentName = "carousel"
const bem = new BEM(componentName)
defineOptions({
  name: componentName,
})

const props = withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "100%",
  loop: true,
  animationType: ANIMATION_TYPE.PRIMARY_HORIZONTAL,
  // TODO
  autoplay: false,
})

const rootStyle = computed(() => {
  const style: CSSProperties = {
    width: props.width || "",
    height: props.height || "",
  }

  return style
})

const {activeIndex, prev, next} = useCarousel(props)
</script>
<template>
  <div :class="[bem.bem()]" :style="rootStyle">
    <div :class="[bem.bem('content')]">
      <slot name="default"></slot>
    </div>
    <div :class="[bem.bem('prev-icon')]" @click="prev">
      <TrilateralIcon :size="20" style="transform: rotateZ(-90deg)"/>
    </div>
    <div :class="[bem.bem('next-icon')]" @click="next">
      <TrilateralIcon :size="20" style="transform: rotateZ(90deg)"/>
    </div>
  </div>
</template>
<style lang="scss">
.#{root("carousel")} {
  --prev-btn-x-position: 0;
  --next-btn-x-position: 0;
  --prev-next-btn-opacity: 0;
  background-color: red;
  position: relative;

  &:hover {
    --prev-btn-x-position: 4px;
    --next-btn-x-position: -4px;
    --prev-next-btn-opacity: .8;
  }

  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__prev-icon,
  &__next-icon {
    width: fit-content;
    height: fit-content;
    position: absolute;
    top: 50%;
    cursor: pointer;
    transform: translateX(var(--x-position)) translateY(-50%);
    opacity: var(--prev-next-btn-opacity);
    transition: 0.2s;

    &:hover {
      --prev-next-btn-opacity: 1;
    }
  }

  &__prev-icon {
    --x-position: var(--prev-btn-x-position);
    left: 0;
  }

  &__next-icon {
    --x-position: var(--next-btn-x-position);
    right: 0;
  }
}
</style>
