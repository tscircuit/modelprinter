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
  innerWidth: positive,
  innerHeight: positive,
  depth: positive,
  thickness: positive,
  footLength: positive,
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
  const legOuter = p.innerWidth / 2 + p.thickness
  const holeInner = (p.holePitch - p.holeDiameter) / 2
  const holeOuter = (p.holePitch + p.holeDiameter) / 2
  if (holeInner <= legOuter || holeOuter >= legOuter + p.footLength)
    issue(
      "Both mounting bores must fit completely within the outward feet and clear the bridge legs",
    )
  if (p.holeDiameter >= p.depth)
    issue(
      "Mounting bores must leave material on the front and back of the feet",
    )
  if (p.innerHeight <= p.thickness)
    issue("Cable opening height must exceed foot thickness")
}
export const flatCableClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const flatCableClipModelDefinitionSchema = z
  .object({ fn: z.literal("flatcableclip"), ...shape })
  .strict()
  .superRefine(validate)
export type FlatCableClipModelPropsInput = z.input<
  typeof flatCableClipModelPropsSchema
>
export type FlatCableClipModelProps = z.output<
  typeof flatCableClipModelPropsSchema
>
export type FlatCableClipModelDefinition = z.output<
  typeof flatCableClipModelDefinitionSchema
>
/** Explicit custom geometry in millimeters; datum and fitting surfaces are documented in docs/flatcableclip.md. */
export function getFlatCableClipDimensions(
  input: FlatCableClipModelPropsInput,
) {
  const p = flatCableClipModelPropsSchema.parse(input)
  const half = p.innerWidth / 2 + p.thickness + p.footLength
  return {
    bounds: [
      [-half, -p.depth / 2, 0],
      [half, p.depth / 2, p.innerHeight + p.thickness],
    ] as const,
    cableOpening: {
      xMin: -p.innerWidth / 2,
      xMax: p.innerWidth / 2,
      yMin: -p.depth / 2,
      yMax: p.depth / 2,
      zMin: 0,
      zMax: p.innerHeight,
    },
    holeCenters: [
      [-p.holePitch / 2, 0],
      [p.holePitch / 2, 0],
    ] as const,
    holeDiameter: p.holeDiameter,
    holeDepth: p.thickness,
  }
}
