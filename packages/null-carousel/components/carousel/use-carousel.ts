import {computed, ComputedRef, reactive, readonly} from "vue"

export function useCarousel() {
  const state = reactive({
    index: 0,
  })

  // TODO
  const maxIndex = 3
  const index = computed({
    get() {
      return state.index
    },
    set(v) {
      let result = v
      if (v < 0) result = 0
      if (v > maxIndex) result = maxIndex
      state.index = result
    }
  })

  function prev() {
    --index.value
  }

  function next() {
    ++index.value
  }

  return {state: readonly(state), prev, next}
}

export default useCarousel
