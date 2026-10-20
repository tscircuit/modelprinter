import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  boreDiameter: positiveLength.default(20),
  baseWidth: positiveLength.default(80),
  baseDepth: positiveLength.default(30),
  baseThickness: positiveLength.default(8),
  housingDiameter: positiveLength.default(46),
  centerHeight: positiveLength.default(30),
  mountSpacing: positiveLength.default(60),
  mountHoleDiameter: positiveLength.default(6),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.housingDiameter <= p.boreDiameter + 12)
    context.addIssue({
      code: "custom",
      message: "Housing must leave space around the shaft for races and balls",
    })
  if (p.centerHeight <= p.baseThickness + p.boreDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "Shaft bore must clear the mounting foot",
    })
  if (p.mountSpacing + p.mountHoleDiameter >= p.baseWidth)
    context.addIssue({
      code: "custom",
      message: "Mounting holes must remain within the foot",
    })
  if (p.mountSpacing - p.mountHoleDiameter <= p.housingDiameter)
    context.addIssue({
      code: "custom",
      message: "Mounting holes must clear the bearing housing",
    })
  if (p.baseDepth <= p.mountHoleDiameter)
    context.addIssue({
      code: "custom",
      message: "Mounting-hole diameter must be less than foot depth",
    })
  if (
    (((p.housingDiameter - p.boreDiameter) * 0.62 - 6) * 0.85) / 2 >=
    p.baseDepth
  )
    context.addIssue({
      code: "custom",
      message: "Ball diameter must fit within housing depth",
    })
  if (
    (((p.housingDiameter - p.boreDiameter) * 0.62 - 6) * 0.85) / 2 >=
    ((2 * p.boreDiameter + (p.housingDiameter - p.boreDiameter) * 0.62) / 2) *
      Math.sin(Math.PI / 10)
  )
    context.addIssue({
      code: "custom",
      message:
        "Adjacent bearing balls must have positive circumferential clearance",
    })
}
export const pillowBlockBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pillowBlockBearingModelDefinitionSchema = z
  .object({ fn: z.literal("pillowblockbearing"), ...shape })
  .strict()
  .superRefine(validate)
export type PillowBlockBearingModelPropsInput = z.input<
  typeof pillowBlockBearingModelPropsSchema
>
export type PillowBlockBearingModelProps = z.output<
  typeof pillowBlockBearingModelPropsSchema
>
export type PillowBlockBearingModelDefinition = z.output<
  typeof pillowBlockBearingModelDefinitionSchema
>
/** Mounted radial bearing in a raised pillow housing. Shaft axis is Y; the mounting-foot bottom is Z=0. Open front race shows rolling elements. Clearance, cage and grease hardware are nominal; no load rating is implied. All lengths are normalized to millimeters. */
export function getPillowBlockBearingDimensions(
  input: PillowBlockBearingModelPropsInput = {},
) {
  const p = pillowBlockBearingModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.baseWidth,
      p.baseDepth + 2,
      p.centerHeight + p.housingDiameter / 2,
    ] as [number, number, number],
    bottomZ: 0,
    topZ: p.centerHeight + p.housingDiameter / 2,
  }
}
