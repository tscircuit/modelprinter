import { z } from "zod"
import {
  modelLengthSchema,
  positiveModelLengthSchema,
} from "./model-length-schema"

const holePosition = {
  panel: z.enum(["base", "left", "right"]),
  /** Panel-local mm, centered on its straight section: u along its length,
   * v along the sheet width. Side-panel u increases upward. */
  u: modelLengthSchema,
  v: modelLengthSchema,
}
export const sheetMetalHoleSchema = z.discriminatedUnion("shape", [
  z
    .object({
      ...holePosition,
      shape: z.literal("round"),
      diameter: positiveModelLengthSchema,
    })
    .strict(),
  z
    .object({
      ...holePosition,
      shape: z.literal("slot"),
      length: positiveModelLengthSchema,
      width: positiveModelLengthSchema,
      axis: z.enum(["u", "v"]).default("v"),
    })
    .strict(),
])
const sheetMetalShape = {
  profile: z.enum(["plate", "angle", "channel"]).default("plate"),
  width: positiveModelLengthSchema,
  /** Straight base length between bend tangencies, not overall width. */
  baseLength: positiveModelLengthSchema,
  /** Straight flange length above the bend tangent. */
  flangeHeight: positiveModelLengthSchema.default(12),
  thickness: positiveModelLengthSchema.default(1),
  insideBendRadius: positiveModelLengthSchema.default(1),
  holes: z.array(sheetMetalHoleSchema).max(100).default([]),
}
export const sheetMetalModelPropsSchema = z.object(sheetMetalShape).strict()
export const sheetMetalModelDefinitionSchema = z
  .object({ fn: z.literal("sheetmetal"), ...sheetMetalShape })
  .strict()
export type SheetMetalModelPropsInput = z.input<
  typeof sheetMetalModelPropsSchema
>
export type SheetMetalModelProps = z.output<typeof sheetMetalModelPropsSchema>
export type SheetMetalHole = z.output<typeof sheetMetalHoleSchema>
