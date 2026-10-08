// String aliases preserve the released JSON schema used by renderers.
export const stringFlags = {
  hexsocket: "drive(hexsocket)",
  fullthread: "thread(full)",
  righthanded: "threadhand(right)",
} as const

export const omittedStringFlags = ["righthanded"] as const
