import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positive = length.refine((value) => value > 0, "Length must be positive")
const nonnegative = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)

const shape = {
  /** Diameter at the rib crests. All lengths normalize to millimeters. */
  outerDiameter: positive.default(6),
  innerDiameter: positive.default(4),
  startLength: nonnegative.default(38),
  endLength: nonnegative.default(112),
  /** Radius measured to the tube centerline. */
  bendRadius: positive.default(60),
  /** Degrees, bending from +Z toward +X in the XZ plane. */
  bendAngle: z.number().finite().min(0).max(180).default(90),
  ribPitch: positive.default(2.25),
  /** Radial distance from crest to root; zero produces a smooth tube. */
  ribDepth: nonnegative.default(0.25),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (props.outerDiameter - 2 * props.ribDepth <= props.innerDiameter)
    context.addIssue({
      code: "custom",
      path: ["ribDepth"],
      message: "Rib roots must leave a positive wall outside the bore",
    })
  if (props.bendAngle > 0 && props.bendRadius <= props.outerDiameter / 2)
    context.addIssue({
      code: "custom",
      path: ["bendRadius"],
      message: "Bend radius must exceed half the outside diameter",
    })
  const totalLength =
    props.startLength +
    props.bendRadius * ((props.bendAngle * Math.PI) / 180) +
    props.endLength
  if (!Number.isFinite(totalLength) || totalLength <= 0)
    context.addIssue({
      code: "custom",
      message: "Centerline length must be finite and positive",
    })
}

/** Generic hollow, ribbed tube in a single planar pose, not a spring simulation. */
export const hollowPositioningArmTubeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hollowPositioningArmTubeModelDefinitionSchema = z
  .object({ fn: z.literal("hollowpositioningarmtube"), ...shape })
  .strict()
  .superRefine(validate)

export type HollowPositioningArmTubeModelPropsInput = z.input<
  typeof hollowPositioningArmTubeModelPropsSchema
>
export type HollowPositioningArmTubeModelProps = z.output<
  typeof hollowPositioningArmTubeModelPropsSchema
>
export type HollowPositioningArmTubeModelDefinition = z.output<
  typeof hollowPositioningArmTubeModelDefinitionSchema
>
export type HollowPositioningArmTubePoint = [number, number, number]

export function getHollowPositioningArmTubeDimensions(
  input: HollowPositioningArmTubeModelPropsInput,
) {
  const props = hollowPositioningArmTubeModelPropsSchema.parse(input)
  const bendLength = props.bendRadius * ((props.bendAngle * Math.PI) / 180)
  const rootDiameter = props.outerDiameter - 2 * props.ribDepth
  return {
    bendLength,
    totalLength: props.startLength + bendLength + props.endLength,
    rootDiameter,
    minimumWallThickness: (rootDiameter - props.innerDiameter) / 2,
  }
}

/** Position and orthonormal section axes at centerline distance s (mm).
 * The remaining section axis is always +Y. End faces are normal to the tangent.
 */
export function getHollowPositioningArmTubeFrame(
  input: HollowPositioningArmTubeModelPropsInput,
  s: number,
) {
  const props = hollowPositioningArmTubeModelPropsSchema.parse(input)
  const { bendLength, totalLength } =
    getHollowPositioningArmTubeDimensions(props)
  if (!Number.isFinite(s) || s < 0 || s > totalLength)
    throw new Error("Centerline distance must be within [0,totalLength]")
  const alongBend = Math.min(bendLength, Math.max(0, s - props.startLength))
  const angle = alongBend / props.bendRadius
  const sine = Math.sin(angle)
  const cosine = Math.cos(angle)
  const alongEnd = Math.max(0, s - props.startLength - bendLength)
  const position: HollowPositioningArmTubePoint = [
    props.bendRadius * (1 - cosine) + alongEnd * sine,
    0,
    Math.min(s, props.startLength) +
      props.bendRadius * sine +
      alongEnd * cosine,
  ]
  const tangent: HollowPositioningArmTubePoint = [sine, 0, cosine]
  const normal: HollowPositioningArmTubePoint = [cosine, 0, -sine]
  return { position, tangent, normal }
}
