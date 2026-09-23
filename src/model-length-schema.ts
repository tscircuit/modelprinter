import { mm } from "@tscircuit/mm"
import { z } from "zod/v4"

export const modelLengthSchema = z
  .union([z.number(), z.string()])
  .transform((value, context) => {
    try {
      const parsed = mm(value)
      if (!Number.isFinite(parsed)) throw new Error("Length is not finite")
      return parsed
    } catch {
      context.addIssue({
        code: "custom",
        message: `Invalid model length: ${String(value)}`,
      })
      return z.NEVER
    }
  })

export const positiveModelLengthSchema = modelLengthSchema.refine(
  (value) => value > 0,
  "Length must be greater than zero",
)

export const nonnegativeModelLengthSchema = modelLengthSchema.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)
