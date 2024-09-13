import {
  computed,
  reactive,
  readonly,
  getCurrentInstance,
  ComponentInternalInstance,
  provide,
  unref,
  inject,
  onMounted,
  onUnmounted,
  VNodeNormalizedChildren
} from "vue"
import lodash from "lodash"

export const carouselCtxKey = Symbol()
export function useCarousel() {
  const state = reactive({
    index: 0,
  })
  const currentInstance = getCurrentInstance()
  if (!currentInstance) throw new TypeError("context error")

  const children: Record<number, ComponentInternalInstance> = reactive({})
  const childList = computed(() => getOrderedChildren(currentInstance, lodash.values(children)))
  const communicator = new class extends Communicator {
    addItem(item: ComponentInternalInstance) {
      children[item.uid] = item
    }
    delItem(item: ComponentInternalInstance) {
      delete children[item.uid]
    }
  }

  provide(carouselCtxKey, communicator)

  const maxIndex = computed(() => unref(childList).length)
  const index = computed({
    get() {
      const max = unref(maxIndex)
      if (state.index > max) state.index = max
      return state.index
    },
    set(v) {
      let result = v
      // TODO 循环 | 限制
      if (v < 0) result = 0
      if (v > unref(maxIndex)) result = unref(maxIndex)
      state.index = result
    }
  })

  function prev() {
    --index.value
  }

  function next() {
    ++index.value
  }


  // TODO 去掉childList
  return {state: readonly(state), prev, next, childList}
}

export function useCarouselItem() {
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

  return {state: readonly(state)}
}

// TODO
function getOrderedChildren<T = (ComponentInternalInstance | VNodeNormalizedChildren)>(root: T, children: T[]): T[] {
  if ((root as ComponentInternalInstance)?.subTree?.children) {
    // const node = (root as ComponentInternalInstance)?.subTree?.children
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
  }
  return []
}

abstract class Communicator {
  abstract addItem(item: ComponentInternalInstance): void
  abstract delItem(item: ComponentInternalInstance): void
}
