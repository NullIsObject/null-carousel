<script setup lang="ts">
const NAME = "null-carousel"
defineOptions({
  name: NAME
})

</script>
<template>
  <div :class="[NAME]">
    <slot name="default"></slot>
  </div>
</template>
