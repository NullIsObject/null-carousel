<script setup lang="ts">
import {BEM} from "null-carousel/private-utils/bem"
import {useCarouselItem} from "./utils"

const componentName = "carousel-item"
const bem = new BEM(componentName)
const ROOT_CLASS_NAME = bem.bem()
defineOptions({
  name: componentName,
})

const {} = useCarouselItem()
</script>
<template>
  <div :class="[ROOT_CLASS_NAME]">
    <slot name="default"></slot>
  </div>
</template>
<style lang="scss">
@include bem("carousel-item") {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
