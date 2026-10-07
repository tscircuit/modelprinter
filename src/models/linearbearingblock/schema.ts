import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** Chosen generic housing dimensions; no SCS or supplier-specific envelope. */
export const linearBearingBlockDefaults = {
  boreDiameter: 8,
  bearingOuterDiameter: 15,
  width: 34,
  length: 24,
  height: 24,
  mountHoleDiameter: 4.5,
  mountPitchX: 24,
  mountPitchY: 16,
  mount: "clearance",
} as const
const positiveLength = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")

const shape = {
  boreDiameter: positiveLength.default(8),
  bearingOuterDiameter: positiveLength.default(15),
  width: positiveLength.default(34),
  length: positiveLength.default(24),
  height: positiveLength.default(24),
  mountHoleDiameter: positiveLength.default(4.5),
  mountPitchX: positiveLength.default(24),
  mountPitchY: positiveLength.default(16),
  mount: z.literal("clearance").default("clearance"),
}
type Props = z.output<z.ZodObject<typeof shape>>
function nominal(props: Props) {
  const boreRadius = props.boreDiameter / 2
  const cartridgeRadius = props.bearingOuterDiameter / 2
  const ballRadius = Math.min(
    (cartridgeRadius - boreRadius) * 0.2,
    props.length * 0.04,
    boreRadius * 0.2,
  )
  const loadedRadius = boreRadius + ballRadius
  const returnRadius = boreRadius + 1.6 * ballRadius
  const turnRadius =
    Math.hypot(
      loadedRadius - returnRadius * Math.cos(Math.PI / 6),
      returnRadius * Math.sin(Math.PI / 6),
    ) / 2
  const sealThickness = Math.min(props.length * 0.04, 0.8 * ballRadius)
  const rowStart = sealThickness + ballRadius + turnRadius
  return {
    boreRadius,
    cartridgeRadius,
    ballRadius,
    loadedRadius,
    returnRadius,
    turnRadius,
    sealThickness,
    rowStart,
    rowEnd: props.length - rowStart,
  }
}
function validate(props: Props, context: z.RefinementCtx) {
  const issue = (path: keyof Props, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  if (props.bearingOuterDiameter <= props.boreDiameter)
    issue(
      "bearingOuterDiameter",
      "Cartridge diameter must exceed shaft diameter",
    )
  if (props.bearingOuterDiameter >= Math.min(props.width, props.height))
    issue(
      "bearingOuterDiameter",
      "The cartridge must leave positive housing wall in X and Z",
    )
  if (props.mountPitchX + props.mountHoleDiameter >= props.width)
    issue("mountPitchX", "Mounting holes must remain inside the X faces")
  if (props.mountPitchY + props.mountHoleDiameter >= props.length)
    issue("mountPitchY", "Mounting holes must remain inside the Y faces")
  if (props.mountPitchX - props.mountHoleDiameter <= props.bearingOuterDiameter)
    issue(
      "mountPitchX",
      "Vertical mounting holes must not intersect the bearing cartridge",
    )
  if (props.mountHoleDiameter >= Math.min(props.mountPitchX, props.mountPitchY))
    issue("mountHoleDiameter", "Four mounting holes must remain separate")
  if (props.bearingOuterDiameter > props.boreDiameter) {
    const d = nominal(props)
    if (d.rowEnd - d.rowStart <= 4 * d.ballRadius)
      issue(
        "length",
        "Cartridge length must leave positive rolling track length",
      )
  }
}
export const linearBearingBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const linearBearingBlockModelDefinitionSchema = z
  .object({ fn: z.literal("linearbearingblock"), ...shape })
  .strict()
  .superRefine(validate)
export type LinearBearingBlockModelPropsInput = z.input<
  typeof linearBearingBlockModelPropsSchema
>
export type LinearBearingBlockModelProps = z.output<
  typeof linearBearingBlockModelPropsSchema
>
export type LinearBearingBlockModelDefinition = z.output<
  typeof linearBearingBlockModelDefinitionSchema
>

/** Datums and nominal independent cartridge details, in mm. */
export function getLinearBearingBlockDimensions(
  input: LinearBearingBlockModelPropsInput = {},
) {
  const props = linearBearingBlockModelPropsSchema.parse(input)
  const d = nominal(props)
  return {
    ...props,
    ...d,
    shaftHeight: props.height / 2,
    trackCount: 6,
    ballsPerRow: Math.min(
      12,
      Math.max(
        2,
        Math.floor((d.rowEnd - d.rowStart) / (2.2 * d.ballRadius)) + 1,
      ),
    ),
    straightSleeveInnerRadius: d.boreRadius + 1.7 * d.ballRadius,
    endChamberRadius: d.returnRadius + 1.1 * d.ballRadius,
    grooveRadius: 1.08 * d.ballRadius,
    returnCageOuterRadius: d.returnRadius - 1.1 * d.ballRadius,
    returnCageHalfAngle: Math.PI / 18,
    cageInnerRadius: d.boreRadius + 0.1 * d.ballRadius,
    cageOuterRadius: d.boreRadius + 1.6 * d.ballRadius,
    cageStart: d.rowStart + 1.1 * d.ballRadius,
    cageEnd: d.rowEnd - 1.1 * d.ballRadius,
    cageSectorHalfAngle: Math.PI / 60,
    mountingCenters: [
      [-props.mountPitchX / 2, -props.mountPitchY / 2],
      [props.mountPitchX / 2, -props.mountPitchY / 2],
      [props.mountPitchX / 2, props.mountPitchY / 2],
      [-props.mountPitchX / 2, props.mountPitchY / 2],
    ] as [number, number][],
  }
}
