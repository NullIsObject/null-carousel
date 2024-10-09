<script setup lang="ts">
import {computed, CSSProperties} from "vue"
import {Property} from "csstype"
import {BEM} from "null-carousel/private-utils/bem"

const componentName = "icon-trilateral"
const bem = new BEM(componentName)
defineOptions({
  name: componentName,
})

interface Props {
  size?: number,
  color?: Property.Color,
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  color: "var(--null-carousel-icon-color)"
})

const style = computed(() => {
  const size = props.size
  const height = Math.sqrt(size ** 2 - (size / 2) ** 2)
  const style: CSSProperties = {
    "width": 0,
    "height": 0,
    "border-bottom": `${height}px solid ${props.color}`,
    "border-left": `${size / 2}px solid transparent`,
    "border-right": `${size / 2}px solid transparent`,
  }
  return style
})
</script>
<template>
  <div :class="bem.bem()" :style="style"></div>
</template>
