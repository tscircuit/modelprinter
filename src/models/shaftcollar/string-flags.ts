// String aliases preserve the released JSON schema used by renderers.
export const stringFlags = {
  setscrew: "mount(setscrew)",
  lefthanded: "threadhand(left)",
  righthanded: "threadhand(right)",
} as const

export const omittedStringFlags = ["righthanded"] as const
