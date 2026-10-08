// String aliases preserve the released JSON schema used by renderers.
export const stringFlags = {
  closedground: "ends(closedground)",
  lefthanded: "hand(left)",
  righthanded: "hand(right)",
  custom: "spec(custom)",
  free: "state(free)",
} as const

export const omittedStringFlags = ["righthanded", "custom", "free"] as const
