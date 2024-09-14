import {computed, getCurrentInstance, inject, onMounted, onUnmounted, reactive, readonly} from "vue"
import {carouselCtxKey, Communicator} from "./utils"

export default function useCarouselItem() {
  const state = reactive({})
  const communicator = inject<Communicator>(carouselCtxKey)
  const currentInstance = getCurrentInstance()
  if (!communicator) throw new TypeError("communicator is undefined")
  if (!currentInstance) throw new TypeError("context error")

  onMounted(() => {
    communicator.addItem(currentInstance)
  })

  onUnmounted(() => {
    communicator.delItem(currentInstance)
  })

  const activeIndex = computed(() => communicator.state.activeIndex)

  return {state: readonly(state), activeIndex}
}
