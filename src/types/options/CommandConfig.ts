export type CommandConfig = {
  isSlash: boolean
  type: number
  allowDms?: boolean
  args?: {[key: string]: {name: string, type: number}}
  builder?: any
}