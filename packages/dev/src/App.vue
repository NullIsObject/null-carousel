<script setup lang="ts">
import {
  Carousel, CarouselItem, IconTrilateral
} from "null-carousel"
import {onMounted, reactive, ref, unref, getCurrentInstance} from "vue"

const state = reactive({
  data: [0, 1, 2]
})

function addItem() {
  state.data.unshift(1)
}

const refCarousel = ref(null)
</script>
<template>
  <div>
    <Carousel ref="refCarousel" width="500px" height="200px">
      <CarouselItem v-for="i in state.data" style="background-color: #99a9bf">{{ i }}</CarouselItem>
    </Carousel>
    <button @click="addItem">addItem</button>
  </div>
</template>
