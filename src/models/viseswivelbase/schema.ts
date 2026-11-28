import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateViseSwivelBaseProps } from "./validate"

const shape = {
  outerDiameter: positive.default(200),
  height: positive.default(35),
  baseThickness: positive.default(15),
  topOuterDiameter: positive.default(160),
  topThickness: positive.default(20),
  pilotDiameter: positive.default(80),
  pilotHeight: positive.default(5),
  arcs: z.literal(2).default(2),
  arcPcd: positive.default(170),
  arcAngle: z.number().gt(0).max(140).default(60),
  arcWidth: positive.default(12),
  topHoles: z.literal(4).default(4),
  topHoleDiameter: positive.default(10.5),
  pitchX: positive.default(100),
  pitchY: positive.default(60),
}

export const viseSwivelBaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateViseSwivelBaseProps)

export const viseSwivelBaseModelDefinitionSchema = z
  .object({ fn: z.literal("viseswivelbase"), ...shape })
  .strict()
  .superRefine(validateViseSwivelBaseProps)

export type ViseSwivelBaseModelPropsInput = z.input<
  typeof viseSwivelBaseModelPropsSchema
>
export type ViseSwivelBaseModelProps = z.output<
  typeof viseSwivelBaseModelPropsSchema
>
export type ViseSwivelBaseModelDefinition = z.output<
  typeof viseSwivelBaseModelDefinitionSchema
>
