import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePcbMountingTrayProps } from "./validate"

const shape = {
  width: positive.default(100),
  depth: positive.default(80),
  height: positive.default(12),
  wallThickness: positive.default(2),
  bossOuterDiameter: positive.default(6),
  bossInnerDiameter: positive.default(3),
  bossHeight: positive.default(5),
  holePattern: z.tuple([positive, positive]).default([88, 68]),
  earCount: z.literal(2).default(2),
}

export const pcbMountingTrayModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePcbMountingTrayProps)

export const pcbMountingTrayModelDefinitionSchema = z
  .object({ fn: z.literal("pcbmountingtray"), ...shape })
  .strict()
  .superRefine(validatePcbMountingTrayProps)

export type PcbMountingTrayModelPropsInput = z.input<
  typeof pcbMountingTrayModelPropsSchema
>
export type PcbMountingTrayModelProps = z.output<
  typeof pcbMountingTrayModelPropsSchema
>
export type PcbMountingTrayModelDefinition = z.output<
  typeof pcbMountingTrayModelDefinitionSchema
>
