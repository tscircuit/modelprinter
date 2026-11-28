import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateMultiGrommetProps } from "./validate"

const shape = {
  outerDiameter: positive.default(30),
  height: positive.default(10),
  panelHoleDiameter: positive.default(25),
  grooveWidth: positive.default(3),
  bores: z.number().int().min(2).default(4),
  boreInnerDiameter: positive.default(4),
  borePcd: positive.default(12),
}

export const multiGrommetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateMultiGrommetProps)

export const multiGrommetModelDefinitionSchema = z
  .object({ fn: z.literal("multigrommet"), ...shape })
  .strict()
  .superRefine(validateMultiGrommetProps)

export type MultiGrommetModelPropsInput = z.input<
  typeof multiGrommetModelPropsSchema
>
export type MultiGrommetModelProps = z.output<
  typeof multiGrommetModelPropsSchema
>
export type MultiGrommetModelDefinition = z.output<
  typeof multiGrommetModelDefinitionSchema
>
