import { z } from "zod"
import { positiveGearLengthSchema as positive } from "./gear-parameter-schemas"

const shape = {
  width: positive.default(40),
  height: positive.default(40),
  thickness: positive.default(4),
  shape: z.literal("righttriangle").default("righttriangle"),
  slotCount: z.literal(2).default(2),
  /** Capsule width and overall length, including both semicircular ends. */
  slot: z.tuple([positive, positive]).default([5, 12]),
  /** Distance along X for the first slot, along Y for the second. */
  centers: z.tuple([positive, positive]).default([12, 28]),
  /** Ligament between each slot and its parallel outer plate edge. */
  edgeMargin: positive.default(1),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  const [width, length] = props.slot
  if (length < width) {
    issue("Slot length must be at least its width", "slot")
    return
  }
  const radius = width / 2
  const halfStraight = (length - width) / 2
  const inset = props.edgeMargin + radius
  const [x, y] = props.centers
  if (!Number.isFinite(inset)) {
    issue("Derived slot centers must be finite", "edgeMargin")
    return
  }
  if (x <= length / 2 || y <= length / 2)
    issue("Slots must leave material at the right-angle corner", "centers")

  // Exact capsule support against x/width + y/height < 1. Scaling avoids
  // overflow in the normal length for very small but otherwise finite inputs.
  const normalRatio =
    Math.min(props.width, props.height) / Math.max(props.width, props.height)
  const capSupport =
    (radius / Math.min(props.width, props.height)) * Math.hypot(1, normalRatio)
  const firstSupport =
    x / props.width +
    inset / props.height +
    halfStraight / props.width +
    capSupport
  const secondSupport =
    inset / props.width +
    y / props.height +
    halfStraight / props.height +
    capSupport
  if (
    !Number.isFinite(firstSupport) ||
    !Number.isFinite(secondSupport) ||
    firstSupport >= 1 ||
    secondSupport >= 1
  )
    issue(
      "Both complete slots must remain inside the triangular plate",
      "centers",
    )

  // Distance between one horizontal and one vertical capsule center segment.
  const dx = Math.max(x - halfStraight - inset, inset - x - halfStraight, 0)
  const dy = Math.max(y - halfStraight - inset, inset - y - halfStraight, 0)
  if (Math.hypot(dx, dy) <= width)
    issue("The two slots must retain a positive separating ligament", "centers")
}

/** Custom flat right triangle, vertices (0,0), (width,0), (0,height).
 * Z=0 is the mounting face and material extends to +thickness. One capsule
 * slot runs along each perpendicular edge; centers are along-edge distances.
 */
export const tSlotGussetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const tSlotGussetModelDefinitionSchema = z
  .object({ fn: z.literal("tslotgusset"), ...shape })
  .strict()
  .superRefine(validate)

export type TSlotGussetModelPropsInput = z.input<
  typeof tSlotGussetModelPropsSchema
>
export type TSlotGussetModelProps = z.output<typeof tSlotGussetModelPropsSchema>
export type TSlotGussetModelDefinition = z.output<
  typeof tSlotGussetModelDefinitionSchema
>

/** Slots pass through +Z; orientation is counterclockwise from +X. */
export function getTSlotGussetMountingSlots(
  input: TSlotGussetModelPropsInput = {},
) {
  const props = tSlotGussetModelPropsSchema.parse(input)
  const [width, length] = props.slot
  const inset = props.edgeMargin + width / 2
  return [
    {
      center: { x: props.centers[0], y: inset, z: 0 },
      orientation: 0,
      width,
      length,
      depth: props.thickness,
      direction: { x: 0, y: 0, z: 1 },
    },
    {
      center: { x: inset, y: props.centers[1], z: 0 },
      orientation: 90,
      width,
      length,
      depth: props.thickness,
      direction: { x: 0, y: 0, z: 1 },
    },
  ] as const
}
