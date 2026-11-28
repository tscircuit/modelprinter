import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDiaphragmPumpProps } from "./validate"

const shape = {
  portOuterDiameter: positive.default(10),
  length: positive.default(100),
  width: positive.default(70),
  height: positive.default(60),
  holePitch: positive.default(60),
  holes: z.number().int().min(2).max(6).default(4),
  holeDiameter: positive.default(5),
  twinDiaphragm: z.boolean().default(true),
  airDrive: z.boolean().default(true),
}

export const diaphragmPumpModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDiaphragmPumpProps)

export const diaphragmPumpModelDefinitionSchema = z
  .object({ fn: z.literal("diaphragmpump"), ...shape })
  .strict()
  .superRefine(validateDiaphragmPumpProps)

export type DiaphragmPumpModelPropsInput = z.input<
  typeof diaphragmPumpModelPropsSchema
>
export type DiaphragmPumpModelProps = z.output<
  typeof diaphragmPumpModelPropsSchema
>
export type DiaphragmPumpModelDefinition = z.output<
  typeof diaphragmPumpModelDefinitionSchema
>
