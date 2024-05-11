import {DefineComponent}   from "vue"
import createComponentName from "./create-component-name"

// TODO 尝试改成在打包时添加组件名和根类名
export function packComponent<T extends DefineComponent<{}, {}, any>>(name: string, component: T) {
  return {
    ...component,
    name: createComponentName(name)
  }
}

export default packComponent
