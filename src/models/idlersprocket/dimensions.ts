import {
  type IdlerSprocketModelPropsInput,
  idlerSprocketModelPropsSchema,
} from "./schema"

export function getIdlerSprocketDimensions(
  input: IdlerSprocketModelPropsInput = {},
) {
  const p = idlerSprocketModelPropsSchema.parse(input)
  return {
    ...p,
    pitchDiameter: p.pitch / Math.sin(Math.PI / p.teeth),
    frontY: -p.toothWidth / 2,
    backY: p.toothWidth / 2,
  }
}
