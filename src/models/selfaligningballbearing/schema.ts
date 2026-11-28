import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSelfAligningBallBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(20),
  outerDiameter: positive.default(47),
  width: positive.default(14),
  rows: z.literal(2).default(2),
  closure: z.enum(["open", "sealed"]).default("open"),
  sphericalOuter: z.literal(true).default(true),
}

export const selfAligningBallBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSelfAligningBallBearingProps)

export const selfAligningBallBearingModelDefinitionSchema = z
  .object({ fn: z.literal("selfaligningballbearing"), ...shape })
  .strict()
  .superRefine(validateSelfAligningBallBearingProps)

export type SelfAligningBallBearingModelPropsInput = z.input<
  typeof selfAligningBallBearingModelPropsSchema
>
export type SelfAligningBallBearingModelProps = z.output<
  typeof selfAligningBallBearingModelPropsSchema
>
export type SelfAligningBallBearingModelDefinition = z.output<
  typeof selfAligningBallBearingModelDefinitionSchema
>
