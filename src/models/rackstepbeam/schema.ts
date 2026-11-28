import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateRackStepBeamProps } from "./validate"

const shape = {
  length: positive.default(1200),
  height: positive.default(100),
  width: positive.default(50),
  wallThickness: positive.default(2.5),
  stepWidth: positive.default(20),
  stepDepth: positive.default(20),
  cornerRadius: nonnegative.default(3),
  endHoles: z.number().int().min(2).max(6).default(2),
  holeDiameter: positive.default(9),
  holePitch: positive.default(50),
}

export const rackStepBeamModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRackStepBeamProps)

export const rackStepBeamModelDefinitionSchema = z
  .object({ fn: z.literal("rackstepbeam"), ...shape })
  .strict()
  .superRefine(validateRackStepBeamProps)

export type RackStepBeamModelPropsInput = z.input<
  typeof rackStepBeamModelPropsSchema
>
export type RackStepBeamModelProps = z.output<
  typeof rackStepBeamModelPropsSchema
>
export type RackStepBeamModelDefinition = z.output<
  typeof rackStepBeamModelDefinitionSchema
>
