<script setup lang="ts">
import {reactive} from "vue"

const NAME = "null-carousel-item"

defineOptions({
  name: NAME
})

const rootStyle = reactive({})
</script>
<template>
  <div :class="[NAME]" :style="rootStyle">
    <slot name="default"></slot>
  </div>
</template>
<style>
.null-carousel-item {
  width: 100%;
  height: 100%;
}
</style>
