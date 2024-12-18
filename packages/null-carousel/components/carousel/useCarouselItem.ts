import {computed, getCurrentInstance, inject, onMounted, onUnmounted, reactive, readonly, watch} from "vue"
import {ANIMATION_TYPE, carouselCtxKey, Communicator} from "./utils"

export default function useCarouselItem() {
  const state = reactive({
    index: -1,
    activeIndex: -1,
    loop: true,
    maxIndex: -1,
    animationType: ANIMATION_TYPE.PRIMARY_HORIZONTAL
  })
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
  const index = computed(() => communicator.getIndex(currentInstance))
  watch(index, index => state.index = index, {immediate: true})
  watch(activeIndex, activeIndex => state.activeIndex = activeIndex, {immediate: true})
  watch(() => communicator.state.maxIndex, v => state.maxIndex = v, {immediate: true})
  watch(() => communicator.state.animationType, v => state.animationType = v, {immediate: true})
  const loop = computed(() => communicator.state.loop && communicator.state.maxIndex >= 2)
  watch(loop, v => state.loop = v, {immediate: true})

  return {state: readonly(state)}
}
