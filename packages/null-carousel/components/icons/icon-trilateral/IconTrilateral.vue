<script setup lang="ts">
import {computed, CSSProperties} from "vue"
import {Property} from "csstype"

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
  const style: CSSProperties = {
    "width": 0,
    "height": 0,
    "border-bottom": `${size}px solid ${props.color}`,
    "border-left": `${size / 2}px solid transparent`,
    "border-right": `${size / 2}px solid transparent`,
  }
  return style
})
</script>
<template>
  <div class="null-carousel__icon" :style="style"></div>
</template>
