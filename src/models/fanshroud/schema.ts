import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFanShroudProps } from "./validate"

const shape = {
  width: positive.default(60),
  height: positive.default(60),
  depth: positive.default(20),
  exitOuterDiameter: positive.default(40),
  wallThickness: positive.default(2),
  holeDiameter: positive.default(4),
  holePitchX: positive.default(50),
  holePitchY: positive.default(50),
  squareToRound: z.literal(true).default(true),
}

export const fanShroudModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFanShroudProps)

export const fanShroudModelDefinitionSchema = z
  .object({ fn: z.literal("fanshroud"), ...shape })
  .strict()
  .superRefine(validateFanShroudProps)

export type FanShroudModelPropsInput = z.input<typeof fanShroudModelPropsSchema>
export type FanShroudModelProps = z.output<typeof fanShroudModelPropsSchema>
export type FanShroudModelDefinition = z.output<
  typeof fanShroudModelDefinitionSchema
>
