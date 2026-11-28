import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBoltOnLiftingLugProps } from "./validate"

const shape = {
  baseWidth: positive.default(100),
  baseDepth: positive.default(80),
  baseThickness: positive.default(12),
  height: positive.default(90),
  lugWidth: positive.default(60),
  lugThickness: positive.default(15),
  eyeDiameter: positive.default(25),
  eyeZ: positive.default(60),
  topRadius: positive.default(30),
  mounts: z.literal(4).default(4),
  holeDiameter: positive.default(11),
  pitchX: positive.default(80),
  pitchY: positive.default(60),
  gussets: z.number().int().min(0).max(4).default(2),
  gussetThickness: positive.default(8),
  gussetHeight: positive.default(45),
}

export const boltOnLiftingLugModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBoltOnLiftingLugProps)

export const boltOnLiftingLugModelDefinitionSchema = z
  .object({ fn: z.literal("boltonliftinglug"), ...shape })
  .strict()
  .superRefine(validateBoltOnLiftingLugProps)

export type BoltOnLiftingLugModelPropsInput = z.input<
  typeof boltOnLiftingLugModelPropsSchema
>
export type BoltOnLiftingLugModelProps = z.output<
  typeof boltOnLiftingLugModelPropsSchema
>
export type BoltOnLiftingLugModelDefinition = z.output<
  typeof boltOnLiftingLugModelDefinitionSchema
>
