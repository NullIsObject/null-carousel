// TODO 待删

import {computed, ComputedRef, reactive, readonly} from "vue"

function useCarousel<T>(dataList: T[]) {
  const state = reactive({
    index: 0,
    dataList: dataList,
  })
  const index = computed({
    get() {
      return state.index
    },
    set(v) {
      let result = v
      if (v < 0) result = 0
      if (v > state.dataList.length - 1) result = state.dataList.length - 1
      state.index = result
    }
  })
  const targetData = computed(() =>
    state.dataList[index.value] instanceof Object ? readonly(state.dataList[index.value] as Object) : state.dataList[index.value]
  ) as ComputedRef<T>

  function prev() {
    --index.value
  }

  function next() {
    ++index.value
  }

  return {state: readonly(state), index, targetData, prev, next}
}

export default useCarousel
