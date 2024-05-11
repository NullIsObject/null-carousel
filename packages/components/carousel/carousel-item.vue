<script setup lang="ts">
import {reactive, CSSProperties} from "vue"
import createComponentName from "@null-carousel/packages/private-utils/create-component-name"

const NAME = createComponentName("carousel-item")

const rootStyle = reactive<CSSProperties>({
  width: "100%",
  height: "100%",
  position: "absolute",
  left: 0,
  top: 0,
})
</script>
<template>
  <div :class="[NAME]" :style="rootStyle">
    <slot name="default"></slot>
  </div>
</template>
