import { z } from "zod"
import { positiveModelLengthSchema } from "./model-length-schema"

/** Overall dimensions from roadmap #13, in millimeters. */
export const ballBearingDefaults = {
  innerDiameter: 8,
  outerDiameter: 22,
  width: 7,
} as const

export const thrustBallBearingDefaults = {
  innerDiameter: 10,
  outerDiameter: 24,
  height: 9,
} as const

const validateDiameters = (
  props: { innerDiameter: number; outerDiameter: number },
  context: z.RefinementCtx,
) => {
  if (props.innerDiameter >= props.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner diameter must be smaller than outer diameter",
    })
  }
}

const ballBearingModelPropsShape = {
  innerDiameter: positiveModelLengthSchema.default(
    ballBearingDefaults.innerDiameter,
  ),
  outerDiameter: positiveModelLengthSchema.default(
    ballBearingDefaults.outerDiameter,
  ),
  /** Overall axial width, including both races. */
  width: positiveModelLengthSchema.default(ballBearingDefaults.width),
}

const thrustBallBearingModelPropsShape = {
  innerDiameter: positiveModelLengthSchema.default(
    thrustBallBearingDefaults.innerDiameter,
  ),
  outerDiameter: positiveModelLengthSchema.default(
    thrustBallBearingDefaults.outerDiameter,
  ),
  /** Overall assembled axial height, including both washers and the cage. */
  height: positiveModelLengthSchema.default(thrustBallBearingDefaults.height),
}

export const ballBearingModelPropsSchema = z
  .object(ballBearingModelPropsShape)
  .strict()
  .superRefine(validateDiameters)

export const ballBearingModelDefinitionSchema = z
  .object({ fn: z.literal("ballbearing"), ...ballBearingModelPropsShape })
  .strict()
  .superRefine(validateDiameters)

export const thrustBallBearingModelPropsSchema = z
  .object(thrustBallBearingModelPropsShape)
  .strict()
  .superRefine(validateDiameters)

export const thrustBallBearingModelDefinitionSchema = z
  .object({
    fn: z.literal("thrustballbearing"),
    ...thrustBallBearingModelPropsShape,
  })
  .strict()
  .superRefine(validateDiameters)

export type BallBearingModelPropsInput = z.input<
  typeof ballBearingModelPropsSchema
>
export type BallBearingModelProps = z.output<typeof ballBearingModelPropsSchema>
export type BallBearingModelDefinition = z.infer<
  typeof ballBearingModelDefinitionSchema
>
export type ThrustBallBearingModelPropsInput = z.input<
  typeof thrustBallBearingModelPropsSchema
>
export type ThrustBallBearingModelProps = z.output<
  typeof thrustBallBearingModelPropsSchema
>
export type ThrustBallBearingModelDefinition = z.infer<
  typeof thrustBallBearingModelDefinitionSchema
>
