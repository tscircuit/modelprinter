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
  panelDiameter: positive.default(22),
  lensDiameter: positive.default(28),
  bodyLength: positive.default(28),
  lensHeight: positive.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.lensDiameter <= p.panelDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible pilotlight dimensions: 1",
    })
  if (p.lensHeight >= p.bodyLength)
    context.addIssue({
      code: "custom",
      message: "Incompatible pilotlight dimensions: 2",
    })
}
export const pilotLightModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pilotLightModelDefinitionSchema = z
  .object({ fn: z.literal("pilotlight"), ...shape })
  .strict()
  .superRefine(validate)
export type PilotLightModelPropsInput = z.input<
  typeof pilotLightModelPropsSchema
>
export type PilotLightModelProps = z.output<typeof pilotLightModelPropsSchema>
export type PilotLightModelDefinition = z.output<
  typeof pilotLightModelDefinitionSchema
>
/** Panel indicator light with raised lens, surrounding bezel, mounting barrel and two rear terminal tabs. Optical diffusion and illumination are not simulated; no electrical ratings or mounting thread are asserted. All normalized lengths are millimeters. */
export function getPilotLightDimensions(input: PilotLightModelPropsInput = {}) {
  const p = pilotLightModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.lensDiameter + 3,
      p.lensDiameter + 3,
      p.bodyLength + p.lensHeight + 6,
    ] as [number, number, number],
  }
}
