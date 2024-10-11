import {
  ComponentInternalInstance,
  VNodeNormalizedChildren,
  VNode,
  isVNode,
  VNodeChild,
} from "vue"

export const carouselCtxKey = Symbol()

export function getOrderedChildren(root: FlattenVNodes | VNode | VNodeNormalizedChildren, children: ComponentInternalInstance[]): ComponentInternalInstance[] {
  const result: ComponentInternalInstance[] = []
  flattedChildren(root)
    .filter((n): n is VNode => isVNode(n))
    .map(n => n.component?.uid)
    .filter((i): i is number => Number.isFinite(i))
    .forEach(uid => {
      const t = children.find(n => n.uid === uid)
      t && result.push(t)
    })
  return result
}

type VNodeChildAtom = Exclude<VNodeChild, Array<any>>
type RawSlots = Exclude<
  VNodeNormalizedChildren,
  Array<any> | null | string
>
type FlattenVNodes = Array<VNodeChildAtom | RawSlots>

/**
 * @see {@link https://github.com/element-plus/element-plus/blob/b45346cc935362703b5925a2aa769ba7bfbba778/packages/utils/vue/vnode.ts#L149}
 */
export const flattedChildren = (
  children: FlattenVNodes | VNode | VNodeNormalizedChildren
): FlattenVNodes => {
  const vNodes = Array.isArray(children) ? children : [children]
  const result: FlattenVNodes = []

  vNodes.forEach((child) => {
    if (Array.isArray(child)) {
      result.push(...flattedChildren(child))
    } else if (isVNode(child) && Array.isArray(child.children)) {
      result.push(...flattedChildren(child.children))
    } else {
      result.push(child)
      if (isVNode(child) && child.component?.subTree) {
        result.push(...flattedChildren(child.component.subTree))
      }
    }
  })
  return result
}

export abstract class Communicator {
  abstract state: Readonly<CommunicatorState>
  abstract addItem(item: ComponentInternalInstance): void
  abstract delItem(item: ComponentInternalInstance): void
  abstract getIndex(item: ComponentInternalInstance): number
}

export interface CommunicatorState {
  activeIndex: number,
  loop: boolean,
  maxIndex: number,
  animationType: ANIMATION_TYPE,
}

export enum ANIMATION_TYPE {
  PRIMARY_HORIZONTAL = "primary-horizontal",
}
