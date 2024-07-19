<script setup lang="ts">
import {
  reactive, CSSProperties
}               from "vue"
import {PREFIX} from "null-carousel/private-utils/config"

const ROOT_CLASS_NAME = `${PREFIX}__carousel`
defineOptions({
  name: `${PREFIX}-carousel`,
})

const rootStyle = reactive<CSSProperties>({
  width: "100%",
  height: "100%",
  position: "absolute",
  left: 0,
  top: 0,
})
</script>
<template>
  <div :class="[ROOT_CLASS_NAME]" :style="rootStyle">
    <slot name="default"></slot>
  </div>
</template>
