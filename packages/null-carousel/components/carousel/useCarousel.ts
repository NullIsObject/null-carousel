import {ComponentInternalInstance, computed, getCurrentInstance, provide, reactive, readonly, unref, watch} from "vue"
import lodash from "lodash"
import {carouselCtxKey, Communicator, getOrderedChildren} from "./utils"

export default function useCarousel(props: Required<Props>) {
  const state = reactive({
    activeIndex: 0,
    loop: props.loop,
    maxIndex: -1,
  })
  const currentInstance = getCurrentInstance()
  if (!currentInstance) throw new TypeError("context error")

  watch(() => props.loop, loop => state.loop = loop, {immediate: true})
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
    getIndex(item: ComponentInternalInstance) {
      return unref(childList).findIndex(i => i.uid === item.uid)
    }
  }

  provide(carouselCtxKey, communicator)

  const maxIndex = computed(() => unref(childList).length - 1)
  watch(maxIndex, maxIndex => state.maxIndex = maxIndex)
  const activeIndex = computed({
    get() {
      const max = unref(maxIndex)
      if (state.activeIndex > max) state.activeIndex = max
      return state.activeIndex
    },
    set(v) {
      let result = v
      if (props.loop) {
        if (v < 0) result = unref(maxIndex)
        if (v > unref(maxIndex)) result = 0
      } else {
        if (v < 0) result = 0
        if (v > unref(maxIndex)) result = unref(maxIndex)
      }
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

export interface Props {
  width?: string,
  height?: string,
  loop?: boolean,
}
