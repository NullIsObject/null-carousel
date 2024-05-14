const PREFIX = "null-carousel"

export function createComponentName(componentName: string) {
  return `${PREFIX}-${componentName}`
}

export default createComponentName
