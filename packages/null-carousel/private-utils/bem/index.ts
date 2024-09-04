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
    let b = ""
    let e = ""
    let m = ""
    if (args.length >= 3) {
      b = args[0]
      e = args[1]
      m = args[2]
    }
    if (args.length === 2) {
      e = args[0]
      m = args[1]
    }
    if (args.length === 1) {
      e = args[0]
    }
    let result = `${PREFIX}__${this.componentName}`
    if (b) result += `-${b}`
    if (e) result += `__${e}`
    if (m) result += `--${m}`
    return result
  }
}

export default BEM
