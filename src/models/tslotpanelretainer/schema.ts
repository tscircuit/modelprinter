import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"

const shape = {
  width: positive,
  height: positive,
  depth: positive,
  thickness: positive,
  panelThickness: positive,
  offset: positive,
  holeDiameter: positive,
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
  if (2 * p.thickness >= p.depth)
    issue(
      "Depth must leave an open ledge between the rear flange and front lip",
      "depth",
    )
  if (p.holeDiameter >= p.width)
    issue(
      "The fixing hole must leave material at both width edges",
      "holeDiameter",
    )
  if (p.offset + p.thickness + p.panelThickness >= p.height)
    issue(
      "The retaining lip must lie below the top of the rear mounting flange",
      "height",
    )
  if (
    p.height - p.thickness - p.holeDiameter <=
    p.offset + p.thickness + p.panelThickness
  )
    issue("The fixing hole must lie wholly above the retaining lip", "height")
}
/** Custom stepped panel-edge clip; no extrusion supplier or T-slot standard is implied. Width is centered on X, rear mounting face is Y=0, depth extends +Y, and bottom Z=0. A horizontal shelf starts at Z=offset and has thickness t. Its front retaining lip rises panelThickness above the shelf top. A panel rests on Z=offset+t behind that lip. The rear flange spans the full height and has one Y-directed fixing hole centered in width, at Z=height-thickness-holeDiameter/2, leaving thickness above the hole. All lengths normalize to millimeters. All dimensions are required. */
export const tSlotPanelRetainerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const tSlotPanelRetainerModelDefinitionSchema = z
  .object({ fn: z.literal("tslotpanelretainer"), ...shape })
  .strict()
  .superRefine(validate)
export type TSlotPanelRetainerModelPropsInput = z.input<
  typeof tSlotPanelRetainerModelPropsSchema
>
export type TSlotPanelRetainerModelProps = z.output<
  typeof tSlotPanelRetainerModelPropsSchema
>
export type TSlotPanelRetainerModelDefinition = z.output<
  typeof tSlotPanelRetainerModelDefinitionSchema
>
export function getTSlotPanelRetainerDimensions(
  input: TSlotPanelRetainerModelPropsInput,
) {
  const p = tSlotPanelRetainerModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.depth, p.height] as [number, number, number],
    bottomZ: 0,
    topZ: p.height,
    shelfTopZ: p.offset + p.thickness,
    lipTopZ: p.offset + p.thickness + p.panelThickness,
    fixingHoleCenter: [
      0,
      p.thickness / 2,
      p.height - p.thickness - p.holeDiameter / 2,
    ] as [number, number, number],
  }
}
