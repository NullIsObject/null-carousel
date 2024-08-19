import {Component} from "vue"
export const PREFIX = import.meta.env.VITE_PREFIX

export function packComponent<T extends Component>(component: T): T {
  return {
    ...component,
    name: `${PREFIX}-${component.name}`
  }
}