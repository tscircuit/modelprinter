// Legacy string selectors remain input aliases for the simplified contract.
export const stringFlags = {
  lefthanded: "threadhand(left)",
  righthanded: "threadhand(right)",
  fullthread: "thread(full)",
  flatends: "ends(flat)",
  custom: "spec(custom)",
} as const

export const omittedStringFlags = [
  "righthanded",
  "flatends",
  "custom",
  "fullthread",
] as const
