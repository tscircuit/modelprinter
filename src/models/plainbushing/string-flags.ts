// String aliases preserve the released JSON schema used by renderers.
export const stringFlags = {
  plainclosed: "style(plainclosed)",
} as const

export const omittedStringFlags = ["plainclosed"] as const
