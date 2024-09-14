<script setup lang="ts">
import {computed, CSSProperties} from "vue"
import useCarousel from "./useCarousel"
import {BEM} from "null-carousel/private-utils/bem"
import TrilateralIcon from "null-carousel/components/icons/icon-trilateral"

const componentName = "carousel"
const bem = new BEM(componentName)
defineOptions({
  name: componentName,
})

interface Props {
  width?: string,
  height?: string,
}

const props = withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "100%"
})

const rootStyle = computed(() => {
  const style: CSSProperties = {
    width: props.width || "",
    height: props.height || "",
  }

  return style
})

const {activeIndex} = useCarousel()
</script>
<template>
  <div :class="[bem.bem()]" :style="rootStyle">
    <div :class="[bem.bem('content')]" style="position:relative;width: 100%;height: 100%;">
      <slot name="default"></slot>
    </div>
    <div style="width: fit-content;height: fit-content;">
      <TrilateralIcon :size="20"/>
    </div>
  </div>
</template>
<style lang="scss">
 //TODO 尝试实现：null-carousel/private-utils/bem
.#{bem("carousel")} {
  background-color: red;
}
</style>
