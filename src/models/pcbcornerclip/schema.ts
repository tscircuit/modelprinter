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
  boardThickness: positiveLength,
  grooveDepth: positiveLength,
  slotBottomZ: positiveLength,
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

  if (!(p.wallThickness < Math.min(p.width, p.depth) / 2))
    context.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Corner walls must leave a central mounting area",
    })
  if (!(p.floorThickness < p.height))
    context.addIssue({
      code: "custom",
      path: ["floorThickness"],
      message: "Floor must be below the clip top",
    })
  if (!(p.grooveDepth < p.wallThickness))
    context.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Board grooves must leave positive back walls",
    })
  if (!(p.slotBottomZ >= p.floorThickness))
    context.addIssue({
      code: "custom",
      path: ["slotBottomZ"],
      message: "Board grooves must not cut through the floor",
    })
  if (!(p.slotBottomZ + p.boardThickness < p.height))
    context.addIssue({
      code: "custom",
      path: ["boardThickness"],
      message: "Board grooves must leave upper retaining lips",
    })
  if (!(p.holeDiameter / 2 + p.wallThickness < Math.min(p.width, p.depth) / 2))
    context.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Mounting bore must clear both corner walls",
    })
}
export const pcbCornerClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pcbCornerClipModelDefinitionSchema = z
  .object({ fn: z.literal("pcbcornerclip"), ...shape })
  .strict()
  .superRefine(validate)
export type PcbCornerClipModelPropsInput = z.input<
  typeof pcbCornerClipModelPropsSchema
>
export type PcbCornerClipModelProps = z.output<
  typeof pcbCornerClipModelPropsSchema
>
export type PcbCornerClipModelDefinition = z.output<
  typeof pcbCornerClipModelDefinitionSchema
>

/** PCB corner support with two perpendicular edge grooves and a central base mounting hole. Lengths normalize to millimeters. See docs/pcbcornerclip.md for the mounting datum and every fixed feature. */
export function getPcbCornerClipDimensions(
  input: PcbCornerClipModelPropsInput,
) {
  const p = pcbCornerClipModelPropsSchema.parse(input)
  return {
    ...p,
    slotTopZ: p.slotBottomZ + p.boardThickness,
    size: [p.width, p.depth, p.height] as [number, number, number],
    bounds: [
      [-p.width / 2, -p.depth / 2, 0],
      [p.width / 2, p.depth / 2, p.height],
    ] as [[number, number, number], [number, number, number]],
    bottomZ: 0,
    topZ: p.height,
  }
}
