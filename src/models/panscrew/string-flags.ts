// String aliases preserve the released JSON schema used by renderers.
export const stringFlags = {
  phillips: "drive(phillips)",
  fullthread: "thread(full)",
  lefthanded: "threadhand(left)",
  righthanded: "threadhand(right)",
  male: "threadgender(male)",
} as const

export const omittedStringFlags = ["righthanded", "male"] as const
