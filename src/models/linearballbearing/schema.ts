import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** Common generic sleeve envelopes. These are de-facto industry dimensions,
 * not a manufacturer selector or a claim about internal raceway construction.
 */
export const linearBallBearingCommonSizes = {
  8: { outerDiameter: 15, length: 24 },
  10: { outerDiameter: 19, length: 29 },
  12: { outerDiameter: 21, length: 30 },
} as const
export const linearBallBearingDefaults = {
  boreDiameter: 8,
  outerDiameter: 15,
  length: 24,
  seals: "both",
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
  outerDiameter: positiveLength.optional(),
  length: positiveLength.optional(),
  seals: z.literal("both").default("both"),
}
type Input = z.output<z.ZodObject<typeof shape>>
function nominal(props: {
  boreDiameter: number
  outerDiameter: number
  length: number
}) {
  const boreRadius = props.boreDiameter / 2
  const outerRadius = props.outerDiameter / 2
  const ballRadius = Math.min(
    (outerRadius - boreRadius) * 0.2,
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
    outerRadius,
    ballRadius,
    loadedRadius,
    returnRadius,
    turnRadius,
    sealThickness,
    rowStart,
    rowEnd: props.length - rowStart,
  }
}
function resolve(input: Input, context: z.RefinementCtx) {
  const common =
    linearBallBearingCommonSizes[
      input.boreDiameter as keyof typeof linearBallBearingCommonSizes
    ]
  const props = {
    ...input,
    outerDiameter: input.outerDiameter ?? common?.outerDiameter ?? 0,
    length: input.length ?? common?.length ?? 0,
  }
  if (
    !common &&
    (input.outerDiameter === undefined || input.length === undefined)
  )
    context.addIssue({
      code: "custom",
      message:
        "A custom shaft diameter requires explicit outer diameter and length",
    })
  if (props.outerDiameter <= props.boreDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outside diameter must exceed shaft diameter",
    })
  else {
    const d = nominal(props)
    if (d.rowEnd - d.rowStart <= 4 * d.ballRadius)
      context.addIssue({
        code: "custom",
        path: ["length"],
        message:
          "Length must leave positive straight tracks between the nominal return chambers",
      })
  }
  return props
}
export const linearBallBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .transform(resolve)
export const linearBallBearingModelDefinitionSchema = z
  .object({ fn: z.literal("linearballbearing"), ...shape })
  .strict()
  .transform((input, context) => ({ fn: input.fn, ...resolve(input, context) }))
export type LinearBallBearingModelPropsInput = z.input<
  typeof linearBallBearingModelPropsSchema
>
export type LinearBallBearingModelProps = z.output<
  typeof linearBallBearingModelPropsSchema
>
export type LinearBallBearingModelDefinition = z.output<
  typeof linearBallBearingModelDefinitionSchema
>

/** Six loaded/return rows and relieved end chambers are nominal visual details. */
export function getLinearBallBearingDimensions(
  input: LinearBallBearingModelPropsInput = {},
) {
  const props = linearBallBearingModelPropsSchema.parse(input)
  const d = nominal(props)
  return {
    ...props,
    ...d,
    trackCount: 6,
    ballsPerRow: Math.min(
      12,
      Math.max(
        2,
        Math.floor((d.rowEnd - d.rowStart) / (2.2 * d.ballRadius)) + 1,
      ),
    ),
    grooveRadius: 1.08 * d.ballRadius,
    straightSleeveInnerRadius: d.boreRadius + 1.7 * d.ballRadius,
    endChamberRadius: d.returnRadius + 1.1 * d.ballRadius,
    returnCageOuterRadius: d.returnRadius - 1.1 * d.ballRadius,
    returnCageHalfAngle: Math.PI / 18,
    cageInnerRadius: d.boreRadius + 0.1 * d.ballRadius,
    cageOuterRadius: d.boreRadius + 1.6 * d.ballRadius,
    cageStart: d.rowStart + 1.1 * d.ballRadius,
    cageEnd: d.rowEnd - 1.1 * d.ballRadius,
    cageSectorHalfAngle: Math.PI / 60,
  }
}
