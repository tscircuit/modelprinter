import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateChannelNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  width: positive.default(20),
  length: positive.default(35),
  height: positive.default(8),
  grooves: z.literal(2).default(2),
  grooveWidth: positive.default(3),
  grooveDepth: positive.default(2),
  springOuterDiameter: positive.default(10),
  springLength: positive.default(15),
  springWireDiameter: positive.default(1),
}

export const channelNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateChannelNutProps)

export const channelNutModelDefinitionSchema = z
  .object({ fn: z.literal("channelnut"), ...shape })
  .strict()
  .superRefine(validateChannelNutProps)

export type ChannelNutModelPropsInput = z.input<
  typeof channelNutModelPropsSchema
>
export type ChannelNutModelProps = z.output<typeof channelNutModelPropsSchema>
export type ChannelNutModelDefinition = z.output<
  typeof channelNutModelDefinitionSchema
>
