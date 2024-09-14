import {ComponentInternalInstance, computed, getCurrentInstance, provide, reactive, readonly, unref} from "vue"
import lodash from "lodash"
import {carouselCtxKey, Communicator, getOrderedChildren} from "./utils"

export default function useCarousel() {
  const state = reactive({
    activeIndex: 0,
  })
  const currentInstance = getCurrentInstance()
  if (!currentInstance) throw new TypeError("context error")

  const children: Record<number, ComponentInternalInstance> = reactive({})
  const childList = computed(() => getOrderedChildren(currentInstance.subTree, lodash.values(children)))
  const communicator = new class extends Communicator {
    state = readonly(state)
    addItem(item: ComponentInternalInstance) {
      children[item.uid] = item
    }
    delItem(item: ComponentInternalInstance) {
      delete children[item.uid]
    }
  }

  provide(carouselCtxKey, communicator)

  const maxIndex = computed(() => unref(childList).length)
  const activeIndex = computed({
    get() {
      const max = unref(maxIndex)
      if (state.activeIndex > max) state.activeIndex = max
      return state.activeIndex
    },
    set(v) {
      let result = v
      // TODO 循环 | 限制
      if (v < 0) result = 0
      if (v > unref(maxIndex)) result = unref(maxIndex)
      state.activeIndex = result
    }
  })

  function prev() {
    --activeIndex.value
  }

  function next() {
    ++activeIndex.value
  }

  return {state: readonly(state), prev, next, activeIndex: readonly(activeIndex)}
}
