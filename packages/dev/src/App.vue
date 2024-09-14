<script setup lang="ts">
import {
  Carousel, CarouselItem, IconTrilateral
} from "null-carousel"
import {onMounted, reactive, ref, unref, getCurrentInstance} from "vue"

const state = reactive({
  data: [1]
})

window.addEventListener("click", () => {
  state.data.unshift(1)
  console.log(state.data.length)
})

const refCarousel = ref(null)
</script>
<template>
  <div>
    <Carousel ref="refCarousel" width="500px" height="200px">
      <CarouselItem v-for="i in state.data" style="background-color: red">111</CarouselItem>
    </Carousel>
  </div>
</template>
