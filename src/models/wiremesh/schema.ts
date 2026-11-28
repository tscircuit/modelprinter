import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWireMeshProps } from "./validate"

const shape = {
  length: positive.default(200),
  width: positive.default(100),
  wireDiameter: positive.default(1),
  pitchX: positive.default(10),
  pitchY: positive.default(10),
  weaveStyle: z.enum(["plainweave", "twillweave"]).default("plainweave"),
  edgeStyle: z.enum(["uncapped", "framededge"]).default("uncapped"),
}

export const wireMeshModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWireMeshProps)

export const wireMeshModelDefinitionSchema = z
  .object({ fn: z.literal("wiremesh"), ...shape })
  .strict()
  .superRefine(validateWireMeshProps)

export type WireMeshModelPropsInput = z.input<typeof wireMeshModelPropsSchema>
export type WireMeshModelProps = z.output<typeof wireMeshModelPropsSchema>
export type WireMeshModelDefinition = z.output<
  typeof wireMeshModelDefinitionSchema
>
