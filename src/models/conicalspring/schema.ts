import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateConicalSpringProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  outerDiameter: positive.default(15),
  endOuterDiameter: positive.default(8),
  wireDiameter: positive.default(1),
  length: positive.default(25),
  turns: z.number().int().min(3).default(8),
  activeTurns: z.number().int().min(1).default(6),
  closedEnds: z.literal(true).default(true),
  handedness: z.enum(["right", "left"]).default("right"),
  freeState: z.literal(true).default(true),
}

export const conicalSpringModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateConicalSpringProps)

export const conicalSpringModelDefinitionSchema = z
  .object({ fn: z.literal("conicalspring"), ...shape })
  .strict()
  .superRefine(validateConicalSpringProps)

export type ConicalSpringModelPropsInput = z.input<
  typeof conicalSpringModelPropsSchema
>
export type ConicalSpringModelProps = z.output<
  typeof conicalSpringModelPropsSchema
>
export type ConicalSpringModelDefinition = z.output<
  typeof conicalSpringModelDefinitionSchema
>
