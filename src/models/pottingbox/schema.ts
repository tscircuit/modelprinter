import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const positiveLength = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")
const shape = {
  width: positiveLength,
  depth: positiveLength,
  height: positiveLength,
  wallThickness: positiveLength,
  floorThickness: positiveLength,
  earLength: positiveLength,
  earWidth: positiveLength,
  holeDiameter: positiveLength,
  holePitch: positiveLength,
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (
    !Number.isFinite(
      Math.max(
        ...Object.values(p).filter(
          (value): value is number => typeof value === "number",
        ),
      ) ** 3,
    )
  )
    context.addIssue({
      code: "custom",
      message: "Dimensions exceed finite geometry limits",
    })

  if (!(2 * p.wallThickness < Math.min(p.width, p.depth)))
    context.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Walls must leave a positive potting cavity",
    })
  if (!(p.floorThickness < p.height))
    context.addIssue({
      code: "custom",
      path: ["floorThickness"],
      message: "Floor must leave a positive cavity depth",
    })
  if (!(p.earWidth <= p.depth && p.holeDiameter < p.earWidth))
    context.addIssue({
      code: "custom",
      path: ["earWidth"],
      message: "Ear width must fit the cup and contain the fixing bore",
    })
  if (!(p.holePitch - p.holeDiameter > p.width))
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting bores must lie outside the cup walls",
    })
  if (!(p.holePitch + p.holeDiameter < p.width + 2 * p.earLength))
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting bores must fit inside the ears",
    })
}
export const pottingBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pottingBoxModelDefinitionSchema = z
  .object({ fn: z.literal("pottingbox"), ...shape })
  .strict()
  .superRefine(validate)
export type PottingBoxModelPropsInput = z.input<
  typeof pottingBoxModelPropsSchema
>
export type PottingBoxModelProps = z.output<typeof pottingBoxModelPropsSchema>
export type PottingBoxModelDefinition = z.output<
  typeof pottingBoxModelDefinitionSchema
>

/** Open rectangular potting cup with two pierced floor-level mounting ears. Lengths normalize to millimeters. See docs/pottingbox.md for the mounting datum and every fixed feature. */
export function getPottingBoxDimensions(input: PottingBoxModelPropsInput) {
  const p = pottingBoxModelPropsSchema.parse(input)
  return {
    ...p,
    cavityWidth: p.width - 2 * p.wallThickness,
    cavityDepth: p.depth - 2 * p.wallThickness,
    cavityHeight: p.height - p.floorThickness,
    size: [p.width + 2 * p.earLength, p.depth, p.height] as [
      number,
      number,
      number,
    ],
    bounds: [
      [-p.width / 2 - p.earLength, -p.depth / 2, 0],
      [p.width / 2 + p.earLength, p.depth / 2, p.height],
    ] as [[number, number, number], [number, number, number]],
    bottomZ: 0,
    topZ: p.height,
  }
}
