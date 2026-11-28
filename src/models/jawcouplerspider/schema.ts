import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateJawCouplerSpiderProps } from "./validate"

const shape = {
  outerDiameter: positive.default(30),
  innerDiameter: positive.default(10),
  width: positive.default(10),
  lobes: z.number().int().min(4).max(12).default(6),
  hubClearance: positive.default(10),
  curvedLobe: z.literal(true).default(true),
}

export const jawCouplerSpiderModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateJawCouplerSpiderProps)

export const jawCouplerSpiderModelDefinitionSchema = z
  .object({ fn: z.literal("jawcouplerspider"), ...shape })
  .strict()
  .superRefine(validateJawCouplerSpiderProps)

export type JawCouplerSpiderModelPropsInput = z.input<
  typeof jawCouplerSpiderModelPropsSchema
>
export type JawCouplerSpiderModelProps = z.output<
  typeof jawCouplerSpiderModelPropsSchema
>
export type JawCouplerSpiderModelDefinition = z.output<
  typeof jawCouplerSpiderModelDefinitionSchema
>
