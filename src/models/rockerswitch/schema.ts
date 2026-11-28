import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateRockerSwitchProps } from "./validate"

const shape = {
  cutoutLength: positive.default(21),
  cutoutWidth: positive.default(15),
  bodyDepth: positive.default(25),
  flangeBorder: positive.default(2),
  curvedRocker: z.literal(true).default(true),
  clips: z.literal(2).default(2),
  contacts: z.union([z.literal(2), z.literal(3)]).default(3),
  tabWidth: positive.default(4.8),
  tabThickness: positive.default(0.8),
}

export const rockerSwitchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRockerSwitchProps)

export const rockerSwitchModelDefinitionSchema = z
  .object({ fn: z.literal("rockerswitch"), ...shape })
  .strict()
  .superRefine(validateRockerSwitchProps)

export type RockerSwitchModelPropsInput = z.input<
  typeof rockerSwitchModelPropsSchema
>
export type RockerSwitchModelProps = z.output<
  typeof rockerSwitchModelPropsSchema
>
export type RockerSwitchModelDefinition = z.output<
  typeof rockerSwitchModelDefinitionSchema
>
