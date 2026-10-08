// String aliases preserve the released JSON schema used by renderers.
export const stringFlags = {
  lefthanded: "threadhand(left)",
  righthanded: "threadhand(right)",
  fullthread: "thread(full)",
  flatends: "ends(flat)",
  custom: "spec(custom)",
} as const

export const omittedStringFlags = ["righthanded", "flatends", "custom"] as const
