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
  spec: z.literal("customv1").default("customv1"),
  length: positiveModelLengthSchema.default(100),
  width: positiveModelLengthSchema.default(8),
  height: positiveModelLengthSchema.default(10),
  slotWidth: positiveModelLengthSchema.default(1.8),
  slotDepth: positiveModelLengthSchema.default(6),
  mountCount: z.literal(2).default(2),
  holeDiameter: positiveModelLengthSchema.default(3),
  holePitch: positiveModelLengthSchema.default(90),
  endWeb: positiveModelLengthSchema.default(1),
  mountEdgeMargin: positiveModelLengthSchema.default(1),
}

function validate(
  model: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) {
  const issue = (path: string, message: string) =>
    ctx.addIssue({ code: "custom", path: [path], message })
  if (model.slotWidth >= model.width)
    issue("slotWidth", "Slot must leave two side walls")
  if (model.slotDepth >= model.height)
    issue("slotDepth", "Slot must leave a positive floor")
  if (model.holeDiameter + 2 * model.mountEdgeMargin > model.width)
    issue("holeDiameter", "Mount holes must leave side margins")
  if (
    model.holePitch + model.holeDiameter + 2 * model.mountEdgeMargin >
    model.length
  )
    issue("holePitch", "Mount holes must leave end margins")
  if (model.holePitch <= model.holeDiameter + 2 * model.endWeb)
    issue("holePitch", "Mount layout must leave a positive central slot length")
}

/** Custom straight top-loading guide; X is length, Y is width, Z is height. */
export const pcbCardGuideModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pcbCardGuideModelDefinitionSchema = z
  .object({ fn: z.literal("pcbcardguide"), ...shape })
  .strict()
  .superRefine(validate)
export type PcbCardGuideModelPropsInput = z.input<
  typeof pcbCardGuideModelPropsSchema
>
export type PcbCardGuideModelProps = z.output<
  typeof pcbCardGuideModelPropsSchema
>
export type PcbCardGuideModelDefinition = z.output<
  typeof pcbCardGuideModelDefinitionSchema
>
