import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

// Strict decimal lengths prevent permissive unit conversion from hiding typos.
const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  width: positiveLength,
  length: positiveLength,
  height: positiveLength,
  holePitch: positiveLength,
  holeDiameter: positiveLength,
  coreHeight: positiveLength,
  plateThickness: positiveLength,
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (
    Math.abs(p.coreHeight + 2 * p.plateThickness - p.height) >
    1e-8 * Math.max(1, p.height)
  )
    context.addIssue({
      code: "custom",
      message: "Invalid sandwichmount dimensions: constraint 1",
    })
  if (p.holePitch + p.holeDiameter >= Math.min(p.width, p.length))
    context.addIssue({
      code: "custom",
      message: "Invalid sandwichmount dimensions: constraint 2",
    })
  if (p.holeDiameter >= p.holePitch)
    context.addIssue({
      code: "custom",
      message: "Invalid sandwichmount dimensions: constraint 3",
    })
}
export const sandwichMountModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const sandwichMountModelDefinitionSchema = z
  .object({ fn: z.literal("sandwichmount"), ...shape })
  .strict()
  .superRefine(validate)
export type SandwichMountModelPropsInput = z.input<
  typeof sandwichMountModelPropsSchema
>
export type SandwichMountModelProps = z.output<
  typeof sandwichMountModelPropsSchema
>
export type SandwichMountModelDefinition = z.output<
  typeof sandwichMountModelDefinitionSchema
>

/** Rectangular bonded isolator centered on XY, bottom Z=0. Equal end plates surround a solid elastomer core. Four plain bores on a centered square grid pass through the entire assembly so fixing access is explicit. No load rating implied. All normalized lengths are millimeters. */
export function getSandwichMountDimensions(
  input: SandwichMountModelPropsInput,
) {
  const p = sandwichMountModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.length, p.height] as [number, number, number],
    bottomZ: 0,
    topZ: p.height,
  }
}
