import {
  type MecanumWheelModelPropsInput,
  mecanumWheelModelPropsSchema,
} from "./schema"

export function getMecanumWheelDimensions(
  input: MecanumWheelModelPropsInput = {},
) {
  const p = mecanumWheelModelPropsSchema.parse(input)
  const rollerAngularPitchDeg = 360 / p.rollers
  return {
    ...p,
    rollerAngularPitchDeg,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
