import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"

const shape = {
  width: positive.default(20),
  /** Equal leg extents from the virtual intersection of the inside flats. */
  legLength: positive.default(40),
  thickness: positive.default(4),
  angle: z.literal(90).default(90),
  holeCount: z.literal(2).default(2),
  holeDiameter: positive.default(5),
  /** One hole per leg, measured from the virtual inside corner. */
  holeOffset: positive.default(20),
  bendRadius: nonnegative.default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  if (!Number.isFinite(props.bendRadius + props.thickness)) {
    issue("Outside bend radius must be finite", "bendRadius")
    return
  }
  if (props.thickness >= props.legLength)
    issue("Thickness must be smaller than the leg length", "thickness")
  if (props.bendRadius >= props.legLength)
    issue("Bend radius must leave a straight portion of each leg", "bendRadius")
  const radius = props.holeDiameter / 2
  if (props.holeDiameter >= props.width)
    issue("Holes must leave material at both width edges", "holeDiameter")
  if (props.holeOffset - radius <= props.bendRadius)
    issue("Holes must lie wholly beyond the bend tangent", "holeOffset")
  if (props.holeOffset + radius >= props.legLength)
    issue("Holes must leave material at the free leg ends", "holeOffset")
}

/** A custom equal-leg 90-degree inside corner with one through-hole per leg.
 * The virtual intersection of the inside flats is X=Z=0; Y is centered width.
 * The legs extend along +X and +Z, with material toward -Z and -X respectively.
 */
export const tSlotInsideCornerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const tSlotInsideCornerModelDefinitionSchema = z
  .object({ fn: z.literal("tslotinsidecorner"), ...shape })
  .strict()
  .superRefine(validate)

export type TSlotInsideCornerModelPropsInput = z.input<
  typeof tSlotInsideCornerModelPropsSchema
>
export type TSlotInsideCornerModelProps = z.output<
  typeof tSlotInsideCornerModelPropsSchema
>
export type TSlotInsideCornerModelDefinition = z.output<
  typeof tSlotInsideCornerModelDefinitionSchema
>

/** Centers are on the inner mounting faces; depth runs into the material. */
export function getTSlotInsideCornerMountingHoles(
  input: TSlotInsideCornerModelPropsInput = {},
) {
  const props = tSlotInsideCornerModelPropsSchema.parse(input)
  return [
    {
      center: { x: props.holeOffset, y: 0, z: 0 },
      direction: { x: 0, y: 0, z: -1 },
      diameter: props.holeDiameter,
      depth: props.thickness,
    },
    {
      center: { x: 0, y: 0, z: props.holeOffset },
      direction: { x: -1, y: 0, z: 0 },
      diameter: props.holeDiameter,
      depth: props.thickness,
    },
  ] as const
}
