import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(
        /^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete length with a supported unit",
      )
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positive = length.refine((value) => value > 0, "Length must be positive")
const nonnegative = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)

const shape = {
  width: positive,
  height: positive,
  depth: positive,
  slotCount: z.number().int().min(1).max(100),
  slotWidth: positive,
  slotDepth: positive,
  slotPitch: positive,
  holeCount: z.literal(2).default(2),
  holeDiameter: positive,
  holePitch: positive,
}
type Props = z.output<z.ZodObject<typeof shape>>
function validate(p: Props, context: z.RefinementCtx) {
  const issue = (message: string) =>
    context.addIssue({ code: "custom", message })
  const lengths = Object.entries(p)
    .filter(
      ([key, value]) =>
        typeof value === "number" &&
        !key.endsWith("Count") &&
        key !== "arcDegrees",
    )
    .map(([, value]) => value as number)
  if (!Number.isFinite(Math.max(...lengths) ** 3))
    issue("Derived geometry dimensions must remain finite")
  const slotExtent = ((p.slotCount - 1) * p.slotPitch + p.slotWidth) / 2
  if (p.slotPitch <= p.slotWidth && p.slotCount > 1)
    issue("Slot pitch must exceed slot width to leave comb teeth")
  if (p.slotDepth >= p.height)
    issue("Slots must leave a continuous bottom spine")
  if (slotExtent >= p.width / 2)
    issue("Centered slot array must leave both end walls")
  if (
    (p.holePitch - p.holeDiameter) / 2 <= slotExtent ||
    (p.holePitch + p.holeDiameter) / 2 >= p.width / 2
  )
    issue(
      "Mounting bores must fit in the two end walls without intersecting slots",
    )
  if (p.holeDiameter >= p.depth)
    issue("Mounting bores must leave material at both Y faces")
}
export const cableCombModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const cableCombModelDefinitionSchema = z
  .object({ fn: z.literal("cablecomb"), ...shape })
  .strict()
  .superRefine(validate)
export type CableCombModelPropsInput = z.input<typeof cableCombModelPropsSchema>
export type CableCombModelProps = z.output<typeof cableCombModelPropsSchema>
export type CableCombModelDefinition = z.output<
  typeof cableCombModelDefinitionSchema
>
/** Explicit custom geometry in millimeters; datum and fitting surfaces are documented in docs/cablecomb.md. */
export function getCableCombDimensions(input: CableCombModelPropsInput) {
  const p = cableCombModelPropsSchema.parse(input)
  return {
    bounds: [
      [-p.width / 2, -p.depth / 2, 0],
      [p.width / 2, p.depth / 2, p.height],
    ] as const,
    slotCenters: Array.from(
      { length: p.slotCount },
      (_, i) => (i - (p.slotCount - 1) / 2) * p.slotPitch,
    ),
    slotFloor: p.height - p.slotDepth,
    holeCenters: [
      [-p.holePitch / 2, 0],
      [p.holePitch / 2, 0],
    ] as const,
    holeDiameter: p.holeDiameter,
    holeDepth: p.height,
  }
}
