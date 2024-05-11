<script setup lang="ts">
import {
  computed, CSSProperties, unref
}                          from "vue"
import useCarousel         from "./use-carousel"
import createComponentName from "@null-carousel/packages/private-utils/create-component-name"

const NAME = createComponentName("carousel")

const _props = defineProps<{
  width?: string,
  height?: string,
}>()

const props = computed(() => ({
  width: _props.width ?? "100%",
  height: _props.height ?? "100%",
}))

const rootStyle = computed(() => {
  const style: CSSProperties = {
    width: unref(props).width,
    height: unref(props).height,
    overflow: "hidden",
  }

  return style
})

const {} = useCarousel()
</script>
<template>
  <div :class="[NAME]" :style="rootStyle">
    <div style="position:relative;width: 100%;height: 100%;">
      <slot name="default"></slot>
    </div>
  </div>
</template>
