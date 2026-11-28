import {
  type GuardPanelClampModelPropsInput,
  guardPanelClampModelPropsSchema,
} from "./schema"

export function getGuardPanelClampDimensions(
  input: GuardPanelClampModelPropsInput = {},
) {
  const p = guardPanelClampModelPropsSchema.parse(input)
  return {
    ...p,
    assembledThickness: p.parts * p.partThickness,
    wireApertureHeight: 2 * p.grooveDepth,
  }
}
