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
  depth: positive,
  height: positive,
  slotWidth: positive,
  slotDepth: positive,
  bodyWidth: positive,
  baseThickness: positive.default(2),
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
  if (p.bodyWidth >= p.width)
    issue("Body width must be smaller than the base to form two mounting feet")
  if (p.baseThickness >= p.height || p.slotDepth >= p.height - p.baseThickness)
    issue("Board slot must leave solid material above the base")
  if (p.slotWidth >= p.depth)
    issue("Board slot must leave retaining walls on both Y sides")
  if (
    (p.holePitch - p.holeDiameter) / 2 <= p.bodyWidth / 2 ||
    (p.holePitch + p.holeDiameter) / 2 >= p.width / 2
  )
    issue(
      "Mounting bores must clear the upright body and leave material at the base ends",
    )
  if (p.holeDiameter >= p.depth)
    issue("Mounting bores must clear both Y edges of the base")
}
export const pcbEdgeSupportModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pcbEdgeSupportModelDefinitionSchema = z
  .object({ fn: z.literal("pcbedgesupport"), ...shape })
  .strict()
  .superRefine(validate)
export type PcbEdgeSupportModelPropsInput = z.input<
  typeof pcbEdgeSupportModelPropsSchema
>
export type PcbEdgeSupportModelProps = z.output<
  typeof pcbEdgeSupportModelPropsSchema
>
export type PcbEdgeSupportModelDefinition = z.output<
  typeof pcbEdgeSupportModelDefinitionSchema
>
/** Explicit custom geometry in millimeters; datum and fitting surfaces are documented in docs/pcbedgesupport.md. */
export function getPcbEdgeSupportDimensions(
  input: PcbEdgeSupportModelPropsInput,
) {
  const p = pcbEdgeSupportModelPropsSchema.parse(input)
  return {
    bounds: [
      [-p.width / 2, -p.depth / 2, 0],
      [p.width / 2, p.depth / 2, p.height],
    ] as const,
    bodyBounds: [
      [-p.bodyWidth / 2, -p.depth / 2, p.baseThickness],
      [p.bodyWidth / 2, p.depth / 2, p.height],
    ] as const,
    boardSlot: {
      xMin: -p.bodyWidth / 2,
      xMax: p.bodyWidth / 2,
      yMin: -p.slotWidth / 2,
      yMax: p.slotWidth / 2,
      zMin: p.height - p.slotDepth,
      zMax: p.height,
    },
    holeCenters: [
      [-p.holePitch / 2, 0],
      [p.holePitch / 2, 0],
    ] as const,
    holeDiameter: p.holeDiameter,
    holeDepth: p.baseThickness,
  }
}
