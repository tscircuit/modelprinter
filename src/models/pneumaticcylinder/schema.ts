import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positive = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegative = industrialLengthSchema.refine(
  (value) => value >= 0,
  "Length must be nonnegative",
)
const shape = {
  boreDiameter: positive.default(32),
  bodyLength: positive.default(80),
  rodDiameter: positive.default(12),
  stroke: positive.default(50),
  extension: nonnegative.default(25),
  endCapLength: positive.default(10),
  portDiameter: positive.default(6),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.rodDiameter >= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible pneumaticcylinder dimensions: 1",
    })
  if (p.extension > p.stroke)
    context.addIssue({
      code: "custom",
      message: "Incompatible pneumaticcylinder dimensions: 2",
    })
  if (2 * p.endCapLength >= p.bodyLength)
    context.addIssue({
      code: "custom",
      message: "Incompatible pneumaticcylinder dimensions: 3",
    })
  if (p.portDiameter >= p.endCapLength)
    context.addIssue({
      code: "custom",
      message: "Incompatible pneumaticcylinder dimensions: 4",
    })
}
export const pneumaticCylinderModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pneumaticCylinderModelDefinitionSchema = z
  .object({ fn: z.literal("pneumaticcylinder"), ...shape })
  .strict()
  .superRefine(validate)
export type PneumaticCylinderModelPropsInput = z.input<
  typeof pneumaticCylinderModelPropsSchema
>
export type PneumaticCylinderModelProps = z.output<
  typeof pneumaticCylinderModelPropsSchema
>
export type PneumaticCylinderModelDefinition = z.output<
  typeof pneumaticCylinderModelDefinitionSchema
>
/** Air cylinder with square end caps. The body is along +Z; extension is the visible rod displacement and cannot exceed stroke. End-cap screw holes and cross-body pneumatic ports are geometric openings. Bore and stroke describe nominal assembly sizing; piston, seals, threads and concealed internals are omitted. All normalized lengths are millimeters. */
export function getPneumaticCylinderDimensions(
  input: PneumaticCylinderModelPropsInput = {},
) {
  const p = pneumaticCylinderModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.boreDiameter + 12,
      p.boreDiameter + 12,
      p.bodyLength + p.extension,
    ] as [number, number, number],
  }
}
