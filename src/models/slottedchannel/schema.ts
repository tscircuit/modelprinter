import { z } from "zod"
import {
  positiveGearLengthSchema as positive,
  nonnegativeGearLengthSchema as nonnegative,
} from "../../gear-parameter-schemas"

const shape = {
  width: positive,
  height: positive,
  thickness: positive,
  innerRadius: nonnegative,
  length: positive,
  slotCount: z.number().finite().int().min(1).max(256),
  slotWidth: positive,
  slotLength: positive,
  pitch: positive,
  endOffset: positive,
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  const largestDimension = Math.max(
    ...Object.values(p).filter(
      (value): value is number => typeof value === "number",
    ),
  )
  if (!Number.isFinite((4 * largestDimension) ** 3)) {
    issue(
      "Dimensions must permit finite derived coordinates and volume",
      "width",
    )
    return
  }
  if (2 * (p.innerRadius + p.thickness) >= p.width)
    issue("The web must retain a straight portion between both bends", "width")
  if (p.innerRadius + p.thickness >= p.height)
    issue("Bends must leave a straight portion on both upright legs", "height")
  if (p.slotLength < p.slotWidth)
    issue("Overall slot length must be at least the slot width", "slotLength")
  if (p.slotWidth >= p.width - 2 * (p.innerRadius + p.thickness))
    issue("Slots must lie wholly within the straight web", "slotWidth")
  if (p.pitch <= p.slotLength && p.slotCount > 1)
    issue("Slot pitch must leave material between consecutive slots", "pitch")
  if (p.endOffset <= p.slotLength / 2)
    issue(
      "The first slot must leave material at the first cut end",
      "endOffset",
    )
  if (p.endOffset + (p.slotCount - 1) * p.pitch + p.slotLength / 2 >= p.length)
    issue("The last slot must leave material at the far cut end", "length")
}
/** Constant-thickness open U-section centered on XY, with its outside web at minimum Y, its opening toward +Y, and cut ends Z=0 and Z=length. Inside radius is innerRadius and outside radius is innerRadius+thickness. Through-web slots have semicircular ends, center X=0, long axis Z, and centers Z=endOffset+i*pitch. slotLength is the overall length including the two round ends. All lengths normalize to millimeters. All dimensions are required. */
export const slottedChannelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const slottedChannelModelDefinitionSchema = z
  .object({ fn: z.literal("slottedchannel"), ...shape })
  .strict()
  .superRefine(validate)
export type SlottedChannelModelPropsInput = z.input<
  typeof slottedChannelModelPropsSchema
>
export type SlottedChannelModelProps = z.output<
  typeof slottedChannelModelPropsSchema
>
export type SlottedChannelModelDefinition = z.output<
  typeof slottedChannelModelDefinitionSchema
>
export function getSlottedChannelDimensions(
  input: SlottedChannelModelPropsInput,
) {
  const p = slottedChannelModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.height, p.length] as [number, number, number],
    bottomZ: 0,
    topZ: p.length,
    slotCenters: Array.from(
      { length: p.slotCount },
      (_, i) =>
        [0, p.thickness / 2 - p.height / 2, p.endOffset + i * p.pitch] as [
          number,
          number,
          number,
        ],
    ),
  }
}
