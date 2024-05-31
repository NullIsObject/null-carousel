<script setup lang="ts">
import {
  computed, CSSProperties, unref
}                  from "vue"
import useCarousel from "./use-carousel"
import {PREFIX}    from "@null-carousel/packages/private-utils/config"

const ROOT_CLASS_NAME = `${PREFIX}__carousel`
defineOptions({
  name: `${PREFIX}-carousel`,
})

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
  <div :class="[ROOT_CLASS_NAME]" :style="rootStyle">
    <div style="position:relative;width: 100%;height: 100%;">
      <slot name="default"></slot>
    </div>
  </div>
</template>
