import {
  type ConicalSpringWasherModelPropsInput,
  conicalSpringWasherModelPropsSchema,
} from "./schema"

export function getConicalSpringWasherDimensions(
  input: ConicalSpringWasherModelPropsInput = {},
) {
  const p = conicalSpringWasherModelPropsSchema.parse(input)
  return {
    ...p,
    dishStroke: p.freeHeight - p.stripThickness,
    bottomZ: 0,
    topZ: p.freeHeight,
  }
}
