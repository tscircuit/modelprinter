import {
  type OmniWheelModelPropsInput,
  omniWheelModelPropsSchema,
} from "./schema"

export function getOmniWheelDimensions(input: OmniWheelModelPropsInput = {}) {
  const p = omniWheelModelPropsSchema.parse(input)
  const rollerAngularPitchDeg = 360 / p.rollers
  return {
    ...p,
    rollerAngularPitchDeg,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
