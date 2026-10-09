import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** Custom three-hole top-flange geometry; all dimensions are millimeters. */
export const ballTransferUnitDefaults = {
  ballDiameter: 25,
  bodyDiameter: 31,
  height: 30,
  ballProtrusion: 7.5,
  flangeDiameter: 45,
  flangeThickness: 3,
  pitchCircleDiameter: 36,
  holeDiameter: 4,
  socketClearance: 0.25,
  faceThreeHole: true,
} as const

const length = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(
        /^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete length with a supported unit",
      )
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positive = length.refine((value) => value > 0, "Length must be positive")
const nonnegative = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)

const shape = {
  ballDiameter: positive.default(ballTransferUnitDefaults.ballDiameter),
  bodyDiameter: positive.default(ballTransferUnitDefaults.bodyDiameter),
  /** Overall height from the flat body bottom to the load-ball top. */
  height: positive.default(ballTransferUnitDefaults.height),
  ballProtrusion: positive.default(ballTransferUnitDefaults.ballProtrusion),
  flangeDiameter: positive.default(ballTransferUnitDefaults.flangeDiameter),
  flangeThickness: positive.default(ballTransferUnitDefaults.flangeThickness),
  pitchCircleDiameter: positive.default(
    ballTransferUnitDefaults.pitchCircleDiameter,
  ),
  holeDiameter: positive.default(ballTransferUnitDefaults.holeDiameter),
  /** Nominal radial clearance of the spherical visualization socket. */
  socketClearance: nonnegative.default(
    ballTransferUnitDefaults.socketClearance,
  ),
  faceThreeHole: z.literal(true).default(true),
}

type Props = z.output<z.ZodObject<typeof shape>>

function validate(props: Props, context: z.RefinementCtx) {
  const issue = (path: keyof Props, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  const ballRadius = props.ballDiameter / 2
  const socketRadius = ballRadius + props.socketClearance
  const bodyHeight = props.height - props.ballProtrusion
  const centerZ = props.height - ballRadius
  const openingSquared =
    socketRadius ** 2 - (ballRadius - props.ballProtrusion) ** 2

  if (
    !Object.values(props).every(
      (value) => typeof value !== "number" || Number.isFinite(value ** 2),
    ) ||
    !Number.isFinite(socketRadius ** 2)
  )
    issue("height", "Derived dimensions must be finite")
  if (props.bodyDiameter <= socketRadius * 2)
    issue("bodyDiameter", "The socket must leave a positive housing wall")
  if (
    props.ballProtrusion >= ballRadius ||
    openingSquared <= 0 ||
    openingSquared >= ballRadius ** 2
  )
    issue(
      "ballProtrusion",
      "The load ball must protrude through an opening smaller than its diameter",
    )
  if (centerZ - socketRadius <= 0)
    issue("height", "The socket must leave a positive housing floor")
  if (props.flangeThickness >= bodyHeight)
    issue("flangeThickness", "The flange must leave a projecting cup body")
  if (props.pitchCircleDiameter - props.holeDiameter <= props.bodyDiameter)
    issue("pitchCircleDiameter", "Mounting holes must clear the cup body")
  if (props.pitchCircleDiameter + props.holeDiameter >= props.flangeDiameter)
    issue("flangeDiameter", "Mounting holes must lie inside the flange edge")
  if (props.holeDiameter >= (props.pitchCircleDiameter * Math.sqrt(3)) / 2)
    issue("holeDiameter", "Mounting holes must not intersect one another")
}

export const ballTransferUnitModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const ballTransferUnitModelDefinitionSchema = z
  .object({ fn: z.literal("balltransferunit"), ...shape })
  .strict()
  .superRefine(validate)

export type BallTransferUnitModelPropsInput = z.input<
  typeof ballTransferUnitModelPropsSchema
>
export type BallTransferUnitModelProps = z.output<
  typeof ballTransferUnitModelPropsSchema
>
export type BallTransferUnitModelDefinition = z.output<
  typeof ballTransferUnitModelDefinitionSchema
>

/** Nominal external envelope and socket, not a load rating or supplier series. */
export function getBallTransferUnitDimensions(
  input: BallTransferUnitModelPropsInput = {},
) {
  const props = ballTransferUnitModelPropsSchema.parse(input)
  const ballRadius = props.ballDiameter / 2
  const socketRadius = ballRadius + props.socketClearance
  const ballCenterZ = props.height - ballRadius
  const bodyHeight = props.height - props.ballProtrusion
  const flangeBottomZ = bodyHeight - props.flangeThickness
  return {
    ...props,
    bodyHeight,
    bodyRadius: props.bodyDiameter / 2,
    flangeRadius: props.flangeDiameter / 2,
    flangeBottomZ,
    ballRadius,
    ballCenterZ,
    socketRadius,
    socketBottomZ: ballCenterZ - socketRadius,
    openingRadius: Math.sqrt(
      socketRadius ** 2 - (ballRadius - props.ballProtrusion) ** 2,
    ),
    mountingHoles: [0, 120, 240].map((degrees) => {
      const angle = (degrees * Math.PI) / 180
      return {
        x: (props.pitchCircleDiameter / 2) * Math.cos(angle),
        y: (props.pitchCircleDiameter / 2) * Math.sin(angle),
        diameter: props.holeDiameter,
        z: flangeBottomZ,
        depth: props.flangeThickness,
      }
    }),
  }
}
