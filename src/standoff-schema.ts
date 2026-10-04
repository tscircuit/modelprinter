import { z } from "zod"
import {
  metricBoltSizeSchema,
  type MetricBoltSize,
} from "./hex-socket-bolt-schema"
import { positiveModelLengthSchema } from "./model-length-schema"

const standoffModelPropsShape = {
  metricSize: metricBoltSizeSchema.default("M3"),
  /** Hexagonal body width measured across opposite flat faces. */
  width: positiveModelLengthSchema.default(5.5),
  /** Body length, excluding any male stud. */
  length: positiveModelLengthSchema.default(10),
}

const validateStandoffWall = (
  standoff: { metricSize: MetricBoltSize; width: number },
  context: z.RefinementCtx,
) => {
  const nominalThreadDiameter = Number(standoff.metricSize.slice(1))
  if (standoff.width <= nominalThreadDiameter) {
    context.addIssue({
      code: "custom",
      path: ["width"],
      message: "Standoff width must exceed the nominal thread diameter",
    })
  }
}

const maleFemaleStandoffModelPropsShape = {
  ...standoffModelPropsShape,
  studLength: positiveModelLengthSchema.default(5),
}

export const femaleStandoffModelPropsSchema = z
  .object(standoffModelPropsShape)
  .strict()
  .superRefine(validateStandoffWall)

export const femaleStandoffModelDefinitionSchema = z
  .object({ fn: z.literal("femalestandoff"), ...standoffModelPropsShape })
  .strict()
  .superRefine(validateStandoffWall)

export const maleFemaleStandoffModelPropsSchema = z
  .object(maleFemaleStandoffModelPropsShape)
  .strict()
  .superRefine(validateStandoffWall)

export const maleFemaleStandoffModelDefinitionSchema = z
  .object({
    fn: z.literal("malefemalestandoff"),
    ...maleFemaleStandoffModelPropsShape,
  })
  .strict()
  .superRefine(validateStandoffWall)

export type FemaleStandoffModelPropsInput = z.input<
  typeof femaleStandoffModelPropsSchema
>
export type FemaleStandoffModelProps = z.output<
  typeof femaleStandoffModelPropsSchema
>
export type FemaleStandoffModelDefinition = z.infer<
  typeof femaleStandoffModelDefinitionSchema
>
export type MaleFemaleStandoffModelPropsInput = z.input<
  typeof maleFemaleStandoffModelPropsSchema
>
export type MaleFemaleStandoffModelProps = z.output<
  typeof maleFemaleStandoffModelPropsSchema
>
export type MaleFemaleStandoffModelDefinition = z.infer<
  typeof maleFemaleStandoffModelDefinitionSchema
>
