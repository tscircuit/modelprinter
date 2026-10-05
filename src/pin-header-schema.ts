import { z } from "zod"
import { modelLengthSchema } from "./model-length-schema"

const positiveModelLengthSchema = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|mil)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")

const shape = {
  pitch: positiveModelLengthSchema.default(2.54),
  pinCount: z.number().int().positive().max(1000).default(6),
  rows: z.number().int().positive().max(100).default(2),
  gender: z.literal("male").default("male"),
  width: positiveModelLengthSchema.default(7.62),
  depth: positiveModelLengthSchema.default(5.08),
  bodyHeight: positiveModelLengthSchema.default(2.54),
  aboveLength: positiveModelLengthSchema.default(6),
  belowLength: positiveModelLengthSchema.default(3),
  pinWidth: positiveModelLengthSchema.default(0.64),
  mount: z.literal("throughhole").default("throughhole"),
  axis: z.literal("vertical").default("vertical"),
}

function validate(
  model: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) {
  const issue = (path: string, message: string) =>
    ctx.addIssue({ code: "custom", path: [path], message })
  if (model.pinCount % model.rows !== 0)
    issue("pinCount", "Total pin count must be divisible by row count")
  if (model.pinWidth >= model.pitch)
    issue("pinWidth", "Adjacent square pins must remain separate")
  if (
    (model.pinCount / model.rows - 1) * model.pitch + model.pinWidth >=
    model.width
  )
    issue("width", "Body must surround every column of pins")
  if ((model.rows - 1) * model.pitch + model.pinWidth >= model.depth)
    issue("depth", "Body must surround every row of pins")
}

/** Unshrouded male header; total count includes every row. */
export const pinHeaderModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pinHeaderModelDefinitionSchema = z
  .object({ fn: z.literal("pinheader"), ...shape })
  .strict()
  .superRefine(validate)
export type PinHeaderModelPropsInput = z.input<typeof pinHeaderModelPropsSchema>
export type PinHeaderModelProps = z.output<typeof pinHeaderModelPropsSchema>
export type PinHeaderModelDefinition = z.output<
  typeof pinHeaderModelDefinitionSchema
>
