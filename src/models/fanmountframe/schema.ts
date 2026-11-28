import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFanMountFrameProps } from "./validate"

const shape = {
  width: positive.default(60),
  height: positive.default(60),
  depth: positive.default(15),
  wallThickness: positive.default(3),
  openingDiameter: positive.default(40),
  bossHeight: positive.default(5),
  fanHoleDiameter: positive.default(3.5),
  holePitchX: positive.default(32),
  holePitchY: positive.default(32),
  ears: z.literal(2).default(2),
  mountHoleDiameter: positive.default(4),
  earHolePitch: positive.default(70),
  earWidth: positive.default(10),
  earLength: positive.default(10),
}

export const fanMountFrameModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFanMountFrameProps)

export const fanMountFrameModelDefinitionSchema = z
  .object({ fn: z.literal("fanmountframe"), ...shape })
  .strict()
  .superRefine(validateFanMountFrameProps)

export type FanMountFrameModelPropsInput = z.input<
  typeof fanMountFrameModelPropsSchema
>
export type FanMountFrameModelProps = z.output<
  typeof fanMountFrameModelPropsSchema
>
export type FanMountFrameModelDefinition = z.output<
  typeof fanMountFrameModelDefinitionSchema
>
