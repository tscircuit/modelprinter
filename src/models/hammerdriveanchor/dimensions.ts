import {
  type HammerDriveAnchorModelPropsInput,
  hammerDriveAnchorModelPropsSchema,
} from "./schema"

export function getHammerDriveAnchorDimensions(
  input: HammerDriveAnchorModelPropsInput = {},
) {
  const p = hammerDriveAnchorModelPropsSchema.parse(input)
  return {
    ...p,
    overallUnsetLength: p.length + p.pinExposed,
    tipZ: 0,
    pinTopZ: p.length + p.pinExposed,
  }
}
