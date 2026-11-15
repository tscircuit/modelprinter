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
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  wallThickness: positiveLength,
  floorThickness: positiveLength,
  slotWidth: positiveLength,
  slotDepth: positiveLength,
  slotBottomZ: positiveLength,
  tabLength: positiveLength,
  tabWidth: positiveLength,
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

  if (!(p.wallThickness < p.width))
    context.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall must leave a board support ledge",
    })
  if (!(p.floorThickness < p.height))
    context.addIssue({
      code: "custom",
      path: ["floorThickness"],
      message: "Floor must be below the rail top",
    })
  if (!(p.slotDepth < p.wallThickness))
    context.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Board groove must leave a positive back wall",
    })
  if (!(p.slotBottomZ >= p.floorThickness))
    context.addIssue({
      code: "custom",
      path: ["slotBottomZ"],
      message: "Board groove must not cut through the floor",
    })
  if (!(p.slotBottomZ + p.slotWidth < p.height))
    context.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Board groove must leave a positive upper retaining lip",
    })
  if (!(p.tabWidth <= p.width && p.holeDiameter < p.tabWidth))
    context.addIssue({
      code: "custom",
      path: ["tabWidth"],
      message: "Tab width must fit the rail and contain the mounting bore",
    })
  if (!(p.holePitch - p.holeDiameter > p.length))
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting bores must lie outside the rail body",
    })
  if (!(p.holePitch + p.holeDiameter < p.length + 2 * p.tabLength))
    context.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting bores must fit inside the end tabs",
    })
}
export const pcbRailModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pcbRailModelDefinitionSchema = z
  .object({ fn: z.literal("pcbrail"), ...shape })
  .strict()
  .superRefine(validate)
export type PcbRailModelPropsInput = z.input<typeof pcbRailModelPropsSchema>
export type PcbRailModelProps = z.output<typeof pcbRailModelPropsSchema>
export type PcbRailModelDefinition = z.output<
  typeof pcbRailModelDefinitionSchema
>

/** L-section PCB edge rail with a horizontal board groove and pierced mounting tabs at both ends. Lengths normalize to millimeters. See docs/pcbrail.md for the mounting datum and every fixed feature. */
export function getPcbRailDimensions(input: PcbRailModelPropsInput) {
  const p = pcbRailModelPropsSchema.parse(input)
  return {
    ...p,
    slotTopZ: p.slotBottomZ + p.slotWidth,
    size: [p.length + 2 * p.tabLength, p.width, p.height] as [
      number,
      number,
      number,
    ],
    bounds: [
      [-p.length / 2 - p.tabLength, -p.width / 2, 0],
      [p.length / 2 + p.tabLength, p.width / 2, p.height],
    ] as [[number, number, number], [number, number, number]],
    bottomZ: 0,
    topZ: p.height,
  }
}
