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
  length: positive,
  width: positive,
  height: positive,
  slotWidth: positive,
  slotDepth: positive,
  cornerRadius: nonnegative.default(1),
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
  if (p.slotWidth >= p.width || p.slotDepth >= p.height)
    issue("U slot must leave two side walls and a continuous top web")
  if (p.cornerRadius >= p.width / 2 || p.cornerRadius >= p.height / 2)
    issue("Corner radius must be smaller than half of both outer dimensions")
  if (
    p.cornerRadius > (p.width - p.slotWidth) / 2 ||
    p.cornerRadius > p.height - p.slotDepth
  )
    issue(
      "Rounded outer corners must not thin or break the U side walls and top web",
    )
}
export const edgeGrommetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const edgeGrommetModelDefinitionSchema = z
  .object({ fn: z.literal("edgegrommet"), ...shape })
  .strict()
  .superRefine(validate)
export type EdgeGrommetModelPropsInput = z.input<
  typeof edgeGrommetModelPropsSchema
>
export type EdgeGrommetModelProps = z.output<typeof edgeGrommetModelPropsSchema>
export type EdgeGrommetModelDefinition = z.output<
  typeof edgeGrommetModelDefinitionSchema
>
/** Explicit custom geometry in millimeters; datum and fitting surfaces are documented in docs/edgegrommet.md. */
export function getEdgeGrommetDimensions(input: EdgeGrommetModelPropsInput) {
  const p = edgeGrommetModelPropsSchema.parse(input)
  return {
    bounds: [
      [-p.length / 2, -p.width / 2, 0],
      [p.length / 2, p.width / 2, p.height],
    ] as const,
    panelSlot: {
      xMin: -p.length / 2,
      xMax: p.length / 2,
      yMin: -p.slotWidth / 2,
      yMax: p.slotWidth / 2,
      zMin: 0,
      zMax: p.slotDepth,
    },
    insertionDirection: [0, 0, 1] as const,
  }
}
