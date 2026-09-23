import { z } from "zod/v4"
import { positiveModelLengthSchema } from "./model-length-schema"

/** Nominal ISO 4762 / DIN 912 dimensions in millimeters (coarse thread).
 * Head/socket dimensions: https://docs.rs-online.com/284d/A700000011319867.pdf
 * Socket depth is the listed minimum. This is a visualization model, without
 * manufacturing tolerances, root radii, or the socket's drill-point relief.
 */
export const hexSocketBoltDimensions = {
  M2: {
    diameter: 2,
    threadPitch: 0.4,
    headDiameter: 3.8,
    headHeight: 2,
    socketWidth: 1.5,
    socketDepth: 1,
  },
  "M2.5": {
    diameter: 2.5,
    threadPitch: 0.45,
    headDiameter: 4.5,
    headHeight: 2.5,
    socketWidth: 2,
    socketDepth: 1.1,
  },
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    headDiameter: 5.5,
    headHeight: 3,
    socketWidth: 2.5,
    socketDepth: 1.3,
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    headDiameter: 7,
    headHeight: 4,
    socketWidth: 3,
    socketDepth: 2,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    headDiameter: 8.5,
    headHeight: 5,
    socketWidth: 4,
    socketDepth: 2.5,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    headDiameter: 10,
    headHeight: 6,
    socketWidth: 5,
    socketDepth: 3,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    headDiameter: 13,
    headHeight: 8,
    socketWidth: 6,
    socketDepth: 4,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    headDiameter: 16,
    headHeight: 10,
    socketWidth: 8,
    socketDepth: 5,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    headDiameter: 18,
    headHeight: 12,
    socketWidth: 10,
    socketDepth: 6,
  },
} as const

export const metricBoltSizeSchema = z.enum([
  "M2",
  "M2.5",
  "M3",
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
])

const hexSocketBoltModelPropsShape = {
  metricSize: metricBoltSizeSchema,
  /** Length under the head, excluding the head itself. */
  length: positiveModelLengthSchema,
  showThreads: z.boolean().default(true),
}

export const hexSocketBoltModelPropsSchema = z
  .object(hexSocketBoltModelPropsShape)
  .strict()
export const hexSocketBoltModelDefinitionSchema = z
  .object({
    fn: z.literal("hexsocketbolt"),
    ...hexSocketBoltModelPropsShape,
  })
  .strict()

export type MetricBoltSize = z.infer<typeof metricBoltSizeSchema>
export type HexSocketBoltModelPropsInput = z.input<
  typeof hexSocketBoltModelPropsSchema
>
export type HexSocketBoltModelProps = z.output<
  typeof hexSocketBoltModelPropsSchema
>
export type HexSocketBoltModelDefinition = z.infer<
  typeof hexSocketBoltModelDefinitionSchema
>
