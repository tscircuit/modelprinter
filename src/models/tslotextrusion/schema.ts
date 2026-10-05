import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"

const shape = {
  width: positive.default(20),
  height: positive.default(20),
  length: positive.default(100),
  profile: z.literal("fourtsolid").default("fourtsolid"),
  slotWidth: positive.default(6),
  pocketWidth: positive.default(10),
  pocketDepth: positive.default(2),
  /** Depth of the narrow slot opening before the wider pocket begins. */
  lipThickness: positive.default(2),
  boreDiameter: nonnegative.default(0),
  cornerRadius: nonnegative.default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  const halfSize = Math.min(props.width, props.height) / 2
  const depth = props.lipThickness + props.pocketDepth
  if (!Number.isFinite(depth)) {
    issue("Total groove depth must be finite", "pocketDepth")
    return
  }
  if (props.pocketWidth <= props.slotWidth)
    issue("A T pocket must be wider than its slot opening", "pocketWidth")
  if (props.cornerRadius >= halfSize)
    issue("Corner radius must be smaller than half the section", "cornerRadius")
  if (props.pocketWidth / 2 + props.cornerRadius >= halfSize)
    issue(
      "Grooves must leave material before the rounded corners",
      "pocketWidth",
    )
  if (depth + props.pocketWidth / 2 >= halfSize)
    issue(
      "Adjacent perpendicular T pockets must remain separate",
      "pocketDepth",
    )
  if (props.boreDiameter / 2 + depth >= halfSize)
    issue(
      "The axial bore must remain separate from every T pocket",
      "boreDiameter",
    )
}

/** Four straight-sided T grooves in a solid rectangular section; no supplier
 * series is implied. XY is centered on the section and Z runs from 0 to length.
 * Groove mouths are centered on the four faces and extend through the length.
 */
export const tSlotExtrusionModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const tSlotExtrusionModelDefinitionSchema = z
  .object({ fn: z.literal("tslotextrusion"), ...shape })
  .strict()
  .superRefine(validate)

export type TSlotExtrusionModelPropsInput = z.input<
  typeof tSlotExtrusionModelPropsSchema
>
export type TSlotExtrusionModelProps = z.output<
  typeof tSlotExtrusionModelPropsSchema
>
export type TSlotExtrusionModelDefinition = z.output<
  typeof tSlotExtrusionModelDefinitionSchema
>

/** All dimensions are in millimeters. This describes fitting geometry only. */
export function getTSlotExtrusionDimensions(
  input: TSlotExtrusionModelPropsInput = {},
) {
  const props = tSlotExtrusionModelPropsSchema.parse(input)
  return {
    grooveDepth: props.lipThickness + props.pocketDepth,
    boreDepth: props.length,
    boreAxis: "z" as const,
    grooveFaces: ["+x", "-x", "+y", "-y"] as const,
    minBoreWallThickness:
      (Math.min(props.width, props.height) - props.boreDiameter) / 2 -
      props.lipThickness -
      props.pocketDepth,
  }
}
