import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** 51100 boundary envelope, also the roadmap #13 proposal 0079 defaults. */
export const thrustBallBearingDefaults = {
  innerDiameter: 10,
  outerDiameter: 24,
  height: 9,
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
  .refine((value) => value > 0, "Length must be greater than zero")

const shape = {
  innerDiameter: positiveLength.default(
    thrustBallBearingDefaults.innerDiameter,
  ),
  outerDiameter: positiveLength.default(
    thrustBallBearingDefaults.outerDiameter,
  ),
  /** Overall assembled distance between the two flat mounting faces. */
  height: positiveLength.default(thrustBallBearingDefaults.height),
}

function validate(
  props: { innerDiameter: number; outerDiameter: number },
  context: z.RefinementCtx,
) {
  if (props.innerDiameter >= props.outerDiameter)
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner diameter must be smaller than outer diameter",
    })
}

export const thrustBallBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const thrustBallBearingModelDefinitionSchema = z
  .object({ fn: z.literal("thrustballbearing"), ...shape })
  .strict()
  .superRefine(validate)

export type ThrustBallBearingModelPropsInput = z.input<
  typeof thrustBallBearingModelPropsSchema
>
export type ThrustBallBearingModelProps = z.output<
  typeof thrustBallBearingModelPropsSchema
>
export type ThrustBallBearingModelDefinition = z.output<
  typeof thrustBallBearingModelDefinitionSchema
>

/** Deterministic illustrative internals; these are not catalog race dimensions. */
export function getThrustBallBearingDimensions(
  input: ThrustBallBearingModelPropsInput = {},
) {
  const props = thrustBallBearingModelPropsSchema.parse(input)
  const radialWidth = (props.outerDiameter - props.innerDiameter) / 2
  const pitchRadius = props.innerDiameter / 4 + props.outerDiameter / 4
  const ballRadius = Math.min(radialWidth * 0.28, props.height * 0.24)
  const grooveRadius = ballRadius * 1.08
  const washerThickness = props.height / 2 - ballRadius * 0.82
  const ballCount = Math.max(
    3,
    Math.min(24, Math.floor((Math.PI * pitchRadius) / (ballRadius * 1.4))),
  )
  return {
    ...props,
    innerRadius: props.innerDiameter / 2,
    outerRadius: props.outerDiameter / 2,
    pitchRadius,
    pitchDiameter: pitchRadius * 2,
    ballRadius,
    ballDiameter: ballRadius * 2,
    ballCount,
    ballCenterZ: props.height / 2,
    washerThickness,
    grooveRadius,
    grooveHalfWidth: ballRadius * Math.sqrt(1.08 ** 2 - 0.82 ** 2),
    cageInnerRadius: pitchRadius - ballRadius * 1.25,
    cageOuterRadius: pitchRadius + ballRadius * 1.25,
    cageThickness: ballRadius * 0.3,
    cagePocketRadius: ballRadius * 1.1,
  }
}
