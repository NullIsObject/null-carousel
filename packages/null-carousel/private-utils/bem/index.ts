import {PREFIX} from "../config"

export class BEM {
  static readonly PREFIX = PREFIX
  readonly componentName: string

  constructor(componentName: string) {
    this.componentName = componentName
  }

  bem(block: string, element: string, modifier: string): string
  bem(element: string, modifier: string): string
  bem(element: string): string
  bem(): string
  bem(...args: string[]) {
    const b = args.length >= 3 ? args[0] : ""
    const e = args.length <= 2 ? args[0] : ""
    const m = args.length === 2 ? args[1] : ""
    let result = `${PREFIX}-${this.componentName}`
    if (b) result += `-${b}`
    if (e) result += `__${e}`
    if (m) result += `--${m}`
    return result
  }
}

export default BEM