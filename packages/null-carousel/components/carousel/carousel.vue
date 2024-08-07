<script setup lang="ts">
import {computed, CSSProperties} from "vue"
import useCarousel from "./use-carousel"
import {BEM} from "null-carousel/private-utils/bem"

const componentName = "carousel"
const bem = new BEM(componentName)
const ROOT_CLASS_NAME = bem.bem()
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
    overflow: "hidden",
  }

  return style
})

const {} = useCarousel()
</script>
<template>
  <div :class="[ROOT_CLASS_NAME]" :style="rootStyle">
    <div style="position:relative;width: 100%;height: 100%;">
      <slot name="default"></slot>
    </div>
  </div>
</template>
