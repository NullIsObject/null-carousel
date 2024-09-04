<script setup lang="ts">
import {BEM} from "null-carousel/private-utils/bem"

const componentName = "carousel-item"
const bem = new BEM(componentName)
const ROOT_CLASS_NAME = bem.bem()
defineOptions({
  name: componentName,
})
</script>
<template>
  <div :class="[ROOT_CLASS_NAME]">
    <slot name="default"></slot>
  </div>
</template>
