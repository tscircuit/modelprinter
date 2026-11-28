import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateViseJawProps } from "./validate"

const shape = {
  length: positive.default(100),
  height: positive.default(30),
  thickness: positive.default(15),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(6.6),
  pitch: positive.default(60),
  holeZ: positive.default(15),
  stepHeight: positive.default(5),
  stepDepth: positive.default(5),
}

export const viseJawModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateViseJawProps)

export const viseJawModelDefinitionSchema = z
  .object({ fn: z.literal("visejaw"), ...shape })
  .strict()
  .superRefine(validateViseJawProps)

export type ViseJawModelPropsInput = z.input<typeof viseJawModelPropsSchema>
export type ViseJawModelProps = z.output<typeof viseJawModelPropsSchema>
export type ViseJawModelDefinition = z.output<
  typeof viseJawModelDefinitionSchema
>
