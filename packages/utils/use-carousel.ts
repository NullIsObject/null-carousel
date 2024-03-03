import {computed, reactive, readonly} from "vue"

function useCarousel<T extends Object>(dataList: T[]) {
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
  const targetData = computed(() => readonly(state.dataList[index.value]))

  function prev() {
    --index.value
  }

  function next() {
    ++index.value
  }

  return {state: readonly(state), index, targetData, prev, next}
}

export default useCarousel
