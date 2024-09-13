<script setup lang="ts">
import {
  Carousel, CarouselItem
} from "null-carousel"
import {onMounted, reactive, ref, unref, getCurrentInstance} from "vue"

const state = reactive({
  data: new Array<number>()
})

const refCarousel = ref(null)
</script>
<template>
  <div>
    <Carousel ref="refCarousel" width="500px" height="200px">
      <template>
        <CarouselItem v-for="i in 10" style="background-color: red">111</CarouselItem>
      </template>
      <CarouselItem v-for="i in 10" style="background-color: red">111</CarouselItem>
    </Carousel>
  </div>
</template>
