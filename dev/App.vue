<script setup lang="ts">
import {
  Carousel, CarouselItem
}                 from "@null-carousel/packages"
import {reactive} from "vue"

const state = reactive({
  data: new Array<number>()
})

</script>
<template>
  <div>
    <Carousel ref="refCarousel" width="500px" height="200px">
      <CarouselItem v-for="i in 10" style="background-color: red">111</CarouselItem>
    </Carousel>
  </div>
</template>
