const PREFIX = "null-carousel"

export function createComponentName(componentName: string) {
  return `${PREFIX}__${componentName}`
}

export default createComponentName
