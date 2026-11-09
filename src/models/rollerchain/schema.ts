import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  pitch: positiveLength.default(12.7),
  linkCount: z.number().int().min(2).max(64).default(6),
  rollerDiameter: positiveLength.default(7.9),
  width: positiveLength.default(8),
  pinDiameter: positiveLength.default(4),
  plateThickness: positiveLength.default(1.2),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.pitch <= p.rollerDiameter * 1.15)
    context.addIssue({
      code: "custom",
      message: "Pitch must leave positive space between adjacent rollers",
    })
  if (p.rollerDiameter <= p.pinDiameter)
    context.addIssue({
      code: "custom",
      message: "Roller diameter must exceed pin diameter",
    })
  if (p.width <= p.plateThickness * 5)
    context.addIssue({
      code: "custom",
      message:
        "Width must leave room for both pairs of plates and a free roller",
    })
  if (p.pinDiameter <= p.plateThickness)
    context.addIssue({
      code: "custom",
      message: "Pin diameter must exceed plate thickness",
    })
}
export const rollerChainModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rollerChainModelDefinitionSchema = z
  .object({ fn: z.literal("rollerchain"), ...shape })
  .strict()
  .superRefine(validate)
export type RollerChainModelPropsInput = z.input<
  typeof rollerChainModelPropsSchema
>
export type RollerChainModelProps = z.output<typeof rollerChainModelPropsSchema>
export type RollerChainModelDefinition = z.output<
  typeof rollerChainModelDefinitionSchema
>
/** Straight roller-chain segment along X with alternating inner/outer side plates, discrete rollers and projecting rivet pins. Roller axes Z. Nominal pitch/width placement assembly; not a named chain standard or flexible/meshing simulation. All lengths are normalized to millimeters. */
export function getRollerChainDimensions(
  input: RollerChainModelPropsInput = {},
) {
  const p = rollerChainModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.pitch * p.linkCount + p.rollerDiameter * 1.25,
      p.rollerDiameter * 1.25,
      p.width + 2 * p.plateThickness,
    ] as [number, number, number],
    bottomZ: -p.plateThickness,
    topZ: p.width + p.plateThickness,
  }
}
