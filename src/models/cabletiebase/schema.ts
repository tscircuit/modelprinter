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
  slotWidth: positiveLength,
  slotHeight: positiveLength,
  floorThickness: positiveLength,
  holeDiameter: positiveLength,
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

  if (!(p.slotWidth < Math.min(p.width, p.depth)))
    context.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Tie tunnels must leave side posts",
    })
  if (!(p.floorThickness + p.slotHeight < p.height))
    context.addIssue({
      code: "custom",
      path: ["slotHeight"],
      message: "Tie tunnels must leave a positive roof",
    })
  if (!(p.holeDiameter < p.slotWidth))
    context.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message:
        "Fixing hole must leave roof material on both sides of the tie tunnel",
    })
}
export const cableTieBaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const cableTieBaseModelDefinitionSchema = z
  .object({ fn: z.literal("cabletiebase"), ...shape })
  .strict()
  .superRefine(validate)
export type CableTieBaseModelPropsInput = z.input<
  typeof cableTieBaseModelPropsSchema
>
export type CableTieBaseModelProps = z.output<
  typeof cableTieBaseModelPropsSchema
>
export type CableTieBaseModelDefinition = z.output<
  typeof cableTieBaseModelDefinitionSchema
>

/** Screw-mounted cable-tie anchor with two perpendicular rectangular tie tunnels. Lengths normalize to millimeters. See docs/cabletiebase.md for the mounting datum and every fixed feature. */
export function getCableTieBaseDimensions(input: CableTieBaseModelPropsInput) {
  const p = cableTieBaseModelPropsSchema.parse(input)
  return {
    ...p,
    roofThickness: p.height - p.floorThickness - p.slotHeight,
    size: [p.width, p.depth, p.height] as [number, number, number],
    bounds: [
      [-p.width / 2, -p.depth / 2, 0],
      [p.width / 2, p.depth / 2, p.height],
    ] as [[number, number, number], [number, number, number]],
    bottomZ: 0,
    topZ: p.height,
  }
}
