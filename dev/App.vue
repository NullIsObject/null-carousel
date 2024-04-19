<script setup lang="ts">
import {Carousel} from "@null-carousel/packages"
import {reactive} from "vue"

const state = reactive({
  data: new Array<number>()
})

</script>
<template>
  <div>
    <Carousel ref="refCarousel">

    </Carousel>
  </div>
</template>
