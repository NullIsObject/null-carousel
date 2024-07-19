<script setup lang="ts">
import {
  computed, CSSProperties
}                  from "vue"
import useCarousel from "./use-carousel"
import {PREFIX}    from "null-carousel/private-utils/config"

const ROOT_CLASS_NAME = `${PREFIX}__carousel`
defineOptions({
  name: `${PREFIX}-carousel`,
})

interface Props{
  width?: string,
  height?: string,
}

const props = withDefaults<Props>(defineProps<Props>(), {
  width: "100%",
  height: "100%"
}) as Required<Props>

const rootStyle = computed(() => {
  const style: CSSProperties = {
    width: props.width,
    height: props.height,
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
