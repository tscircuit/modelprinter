import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeElevatorBoltProps } from "./normalize"
import { validateElevatorBoltProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  length: positive.default(30),
  threadLength: positive.default(20),
  headOuterDiameter: positive.default(22),
  headHeight: positive.default(2),
  flatHead: z.literal(true).default(true),
  squareNeck: z.literal(true).default(true),
  neckWidth: positive.default(6),
  neckLength: positive.default(4),
}

export const elevatorBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateElevatorBoltProps)
  .transform(normalizeElevatorBoltProps)

export const elevatorBoltModelDefinitionSchema = z
  .object({ fn: z.literal("elevatorbolt"), ...shape })
  .strict()
  .superRefine(validateElevatorBoltProps)
  .transform(normalizeElevatorBoltProps)

export type ElevatorBoltModelPropsInput = z.input<
  typeof elevatorBoltModelPropsSchema
>
export type ElevatorBoltModelProps = z.output<
  typeof elevatorBoltModelPropsSchema
>
export type ElevatorBoltModelDefinition = z.output<
  typeof elevatorBoltModelDefinitionSchema
>
