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
  diameter: positive.default(35),
  height: positive.default(22),
  neckDiameter: positive.default(12),
  neckLength: positive.default(12),
  wallThickness: positive.default(2),
  boreDiameter: positive.default(6),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.neckDiameter >= p.diameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible vacuumcup dimensions: 1",
    })
  if (2 * p.wallThickness >= p.neckDiameter - p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible vacuumcup dimensions: 2",
    })
  if (p.boreDiameter >= p.neckDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible vacuumcup dimensions: 3",
    })
  if (p.wallThickness >= p.height / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible vacuumcup dimensions: 4",
    })
}
export const vacuumCupModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const vacuumCupModelDefinitionSchema = z
  .object({ fn: z.literal("vacuumcup"), ...shape })
  .strict()
  .superRefine(validate)
export type VacuumCupModelPropsInput = z.input<typeof vacuumCupModelPropsSchema>
export type VacuumCupModelProps = z.output<typeof vacuumCupModelPropsSchema>
export type VacuumCupModelDefinition = z.output<
  typeof vacuumCupModelDefinitionSchema
>
/** Tapered vacuum suction cup with a hollow bell, sealing lip and through-bored connection neck. Cup lip rests on Z=0; no flexible deformation, thread form or vacuum rating is modeled. All normalized lengths are millimeters. */
export function getVacuumCupDimensions(input: VacuumCupModelPropsInput = {}) {
  const p = vacuumCupModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.diameter + 2 * p.wallThickness,
      p.diameter + 2 * p.wallThickness,
      p.height + p.neckLength,
    ] as [number, number, number],
  }
}
