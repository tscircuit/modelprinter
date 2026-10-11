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
  cableDiameter: positive,
  width: positive,
  height: positive,
  thickness: positive,
  arcDegrees: z.number().finite().gt(180).lt(360).default(240),
  tabLength: positive,
  holeDiameter: positive,
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
  if (
    Math.abs(p.height - (p.cableDiameter + 2 * p.thickness)) >
    p.height * 1e-9
  )
    issue(
      "Height must equal cable diameter plus twice the circular wall thickness",
    )
  if (p.thickness <= (p.cableDiameter / 2) * Math.tan(Math.PI / 180) ** 2)
    issue(
      "Circular wall is too thin for the declared two-degree facet resolution",
    )
  if (p.holeDiameter >= p.width || p.holeDiameter >= p.tabLength)
    issue("Mounting hole must leave material at both sides and ends of the tab")
}
export const cableClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const cableClipModelDefinitionSchema = z
  .object({ fn: z.literal("cableclip"), ...shape })
  .strict()
  .superRefine(validate)
export type CableClipModelPropsInput = z.input<typeof cableClipModelPropsSchema>
export type CableClipModelProps = z.output<typeof cableClipModelPropsSchema>
export type CableClipModelDefinition = z.output<
  typeof cableClipModelDefinitionSchema
>
/** Explicit custom geometry in millimeters; datum and fitting surfaces are documented in docs/cableclip.md. */
export function getCableClipDimensions(input: CableClipModelPropsInput) {
  const p = cableClipModelPropsSchema.parse(input)
  const radius = p.height / 2
  return {
    bounds: [
      [-radius, -p.width / 2, 0],
      [radius + p.tabLength, p.width / 2, p.height],
    ] as const,
    cableAxis: {
      point: [0, 0, radius] as const,
      direction: [0, 1, 0] as const,
      diameter: p.cableDiameter,
    },
    openingDirection: [1, 0, 0] as const,
    holeCenters: [[radius + p.tabLength / 2, 0]] as const,
    holeDiameter: p.holeDiameter,
    holeDepth: p.thickness,
  }
}
