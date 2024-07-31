<script setup lang="ts">
import {PREFIX} from "null-carousel/private-utils/config"

const ROOT_CLASS_NAME = `${PREFIX}__carousel-item`
defineOptions({
  name: `${PREFIX}-carousel-item`,
})
</script>
<template>
  <div :class="[ROOT_CLASS_NAME]">
    <slot name="default"></slot>
  </div>
</template>
<style lang="scss">
.#{$prefix}__carousel-item {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
