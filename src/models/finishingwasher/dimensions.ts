import {
  type FinishingWasherModelPropsInput,
  finishingWasherModelPropsSchema,
} from "./schema"

export function getFinishingWasherDimensions(
  input: FinishingWasherModelPropsInput = {},
) {
  const p = finishingWasherModelPropsSchema.parse(input)
  const cupInnerSpan = p.outerDiameter - 2 * p.rimWidth
  return {
    ...p,
    cupInnerSpan,
    bottomZ: 0,
    topZ: p.height,
  }
}
