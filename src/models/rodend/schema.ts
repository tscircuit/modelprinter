import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  headDiameter: positiveLength.default(28),
  boreDiameter: positiveLength.default(12),
  headWidth: positiveLength.default(12),
  stemDiameter: positiveLength.default(10),
  stemLength: positiveLength.default(30),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.headDiameter <= p.boreDiameter * 1.7)
    context.addIssue({
      code: "custom",
      message:
        "The head must leave material around its spherical insert and bore",
    })
  if (p.headWidth >= p.headDiameter * 0.65)
    context.addIssue({
      code: "custom",
      message: "Head width must be less than 65 percent of head diameter",
    })
  if (p.headWidth <= p.boreDiameter * 0.35)
    context.addIssue({
      code: "custom",
      message: "Head width must expose a useful inner spherical ring",
    })
  if (p.stemDiameter >= p.headWidth)
    context.addIssue({
      code: "custom",
      message: "The stem must fit within the head width",
    })
  if (p.stemDiameter >= p.headDiameter / 2)
    context.addIssue({
      code: "custom",
      message: "The stem diameter must be smaller than the head radius",
    })
  if (
    Math.sqrt((p.headDiameter * 0.7) ** 2 - p.headWidth ** 2) <= p.boreDiameter
  )
    context.addIssue({
      code: "custom",
      message: "Spherical insert must surround the bore at both end faces",
    })
}
export const rodEndModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rodEndModelDefinitionSchema = z
  .object({ fn: z.literal("rodend"), ...shape })
  .strict()
  .superRefine(validate)
export type RodEndModelPropsInput = z.input<typeof rodEndModelPropsSchema>
export type RodEndModelProps = z.output<typeof rodEndModelPropsSchema>
export type RodEndModelDefinition = z.output<typeof rodEndModelDefinitionSchema>
/** Rod-end eye with a curved spherical inner insert and smooth male-stem envelope pointing toward -Y. Eye axis Z, bottom Z=0. Thread major diameter only, no threads, articulation limit or load rating. All lengths are normalized to millimeters. */
export function getRodEndDimensions(input: RodEndModelPropsInput = {}) {
  const p = rodEndModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.headDiameter, p.headDiameter + p.stemLength, p.headWidth] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.headWidth,
  }
}
