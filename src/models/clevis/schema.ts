import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  width: positiveLength.default(30),
  length: positiveLength.default(45),
  height: positiveLength.default(20),
  gap: positiveLength.default(14),
  backThickness: positiveLength.default(10),
  pinDiameter: positiveLength.default(8),
  mountDiameter: positiveLength.default(10),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.gap >= p.width)
    context.addIssue({
      code: "custom",
      message: "Ear gap must leave two positive-width arms",
    })
  if (p.pinDiameter >= p.height)
    context.addIssue({
      code: "custom",
      message: "Cross-pin hole must fit within each ear height",
    })
  if (p.mountDiameter >= Math.min(p.width, p.height))
    context.addIssue({
      code: "custom",
      message: "Rear mounting bore must remain inside the rear wall",
    })
  if (p.length <= p.backThickness + p.pinDiameter * 2)
    context.addIssue({
      code: "custom",
      message:
        "Fork length must leave a rear wall and complete pin-hole edge margins",
    })
}
export const clevisModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const clevisModelDefinitionSchema = z
  .object({ fn: z.literal("clevis"), ...shape })
  .strict()
  .superRefine(validate)
export type ClevisModelPropsInput = z.input<typeof clevisModelPropsSchema>
export type ClevisModelProps = z.output<typeof clevisModelPropsSchema>
export type ClevisModelDefinition = z.output<typeof clevisModelDefinitionSchema>
/** Fork clevis with parallel ears, shared cross-pin bore along X and rear mounting bore along Y. Rear plane Y=0, underside Z=0. Bores are smooth; pin/thread geometry and strength are not implied. All lengths are normalized to millimeters. */
export function getClevisDimensions(input: ClevisModelPropsInput = {}) {
  const p = clevisModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.length, p.height] as [number, number, number],
    bottomZ: 0,
    topZ: p.height,
  }
}
