<script setup lang="ts">
import {Carousel, CarouselItem} from "null-carousel"
import {reactive, ref} from "vue"

const state = reactive({
  data: [0, 1, 2, 3, 4]
})

function addItem() {
  state.data.unshift(1)
}

const refCarousel = ref(null)
</script>
<template>
  <div>
    <Carousel ref="refCarousel" width="500px" height="200px">
      <CarouselItem v-for="i in state.data" class="item">{{ i }}</CarouselItem>
    </Carousel>
    <button @click="addItem">addItem</button>
  </div>
</template>
<style>
.item:nth-child(2n) {
  background-color: #99a9bf;
}

.item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
