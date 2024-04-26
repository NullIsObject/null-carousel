<script setup lang="ts">
import {
  computed, unref
} from "vue"

const NAME = "null-carousel"

defineOptions({
  name: NAME
})

const directionMap = {
  row: "row",
  column: "column"
}

const _props = defineProps<{
  width?: string,
  height?: string,
  direction?: keyof typeof directionMap,
}>()

const props = computed(() => ({
  width: _props.width ?? "100%",
  height: _props.height ?? "100%",
  direction: _props.direction ?? "row",
}))

const rootStyle = computed(() => {
  const style = {
    width: unref(props).width,
    height: unref(props).height,
    overflow: "hidden",
    flexDirection: "column",
  }
  style.flexDirection = directionMap[unref(props).direction]

  return style
})
</script>
<template>
  <div :class="[NAME]" :style="rootStyle">
    <slot name="default"></slot>
  </div>
</template>
<style>
.null-carousel {
  display: flex;
}

.null-carousel > * {
  flex-shrink: 0;
}
</style>
