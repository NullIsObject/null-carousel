import {ref, getCurrentInstance, onMounted, readonly} from "vue"

export function useHover(dom?: HTMLElement) {
  const that = getCurrentInstance()
  let el = dom
  const isHover = ref(false)
  onMounted(() => {
    el ??= that?.vnode.el as HTMLElement
    el.addEventListener("mouseenter", () => isHover.value = true)
    el.addEventListener("mouseleave", () => isHover.value = false)
  })
  return readonly(isHover)
}
