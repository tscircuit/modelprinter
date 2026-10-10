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
  innerDiameter: positiveLength,
  bandWidth: positiveLength,
  thickness: positiveLength,
  tabLength: positiveLength,
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

  if (!(p.holeDiameter < p.bandWidth))
    context.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Mounting hole must fit inside the band width",
    })
  if (!(p.holeDiameter < p.tabLength))
    context.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Mounting hole must fit inside the exposed tab length",
    })
}
export const cableClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const cableClampModelDefinitionSchema = z
  .object({ fn: z.literal("cableclamp"), ...shape })
  .strict()
  .superRefine(validate)
export type CableClampModelPropsInput = z.input<
  typeof cableClampModelPropsSchema
>
export type CableClampModelProps = z.output<typeof cableClampModelPropsSchema>
export type CableClampModelDefinition = z.output<
  typeof cableClampModelDefinitionSchema
>

/** P-shaped cable strap with a closed circular passage and two overlapping pierced mounting tabs. Lengths normalize to millimeters. See docs/cableclamp.md for the mounting datum and every fixed feature. */
export function getCableClampDimensions(input: CableClampModelPropsInput) {
  const p = cableClampModelPropsSchema.parse(input)
  const radius = p.innerDiameter / 2 + p.thickness
  const topZ = 2 * radius + p.thickness
  return {
    ...p,
    radius,
    ringCenterZ: radius + p.thickness,
    mountingHoleX: -radius - p.tabLength / 2,
    size: [2 * radius + p.tabLength, p.bandWidth, topZ] as [
      number,
      number,
      number,
    ],
    bounds: [
      [-radius - p.tabLength, -p.bandWidth / 2, 0],
      [radius, p.bandWidth / 2, topZ],
    ] as [[number, number, number], [number, number, number]],
    bottomZ: 0,
    topZ,
  }
}
