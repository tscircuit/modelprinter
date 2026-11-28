import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotGantryPlateProps } from "./validate"

const shape = {
  width: positive.default(100),
  height: positive.default(80),
  thickness: positive.default(6),
  wheelSpacing: positive.default(60),
  vGrooveWheels: z.literal(true).default(true),
  axleHoleCount: z.literal(4).default(4),
  holeDiameter: positive.default(5),
  eccentricDiameter: positive.default(7),
}

export const tSlotGantryPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotGantryPlateProps)

export const tSlotGantryPlateModelDefinitionSchema = z
  .object({ fn: z.literal("tslotgantryplate"), ...shape })
  .strict()
  .superRefine(validateTSlotGantryPlateProps)

export type TSlotGantryPlateModelPropsInput = z.input<
  typeof tSlotGantryPlateModelPropsSchema
>
export type TSlotGantryPlateModelProps = z.output<
  typeof tSlotGantryPlateModelPropsSchema
>
export type TSlotGantryPlateModelDefinition = z.output<
  typeof tSlotGantryPlateModelDefinitionSchema
>
