import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      )
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegativeLength = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)
const shape = {
  width: positiveLength,
  depth: positiveLength,
  height: positiveLength,
  wallThickness: positiveLength,
  baseThickness: positiveLength.optional(),
  seatWidth: positiveLength,
  seatDepth: positiveLength,
  holeDiameter: positiveLength,
  cornerCup: z.literal(true).default(true),
}
const resolve = <P extends { wallThickness: number; baseThickness?: number }>(
  p: P,
) => ({ ...p, baseThickness: p.baseThickness ?? p.wallThickness })

type ResolvedProps = z.output<z.ZodObject<typeof shape>> & {
  baseThickness: number
}
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  if (2 * p.wallThickness >= Math.min(p.width, p.depth))
    issue(
      "Locating walls must leave space around the central fixing hole",
      "wallThickness",
    )
  if (p.baseThickness >= p.height)
    issue("The base must leave positive-height locating walls", "baseThickness")
  if (
    p.seatWidth > p.width - p.wallThickness ||
    p.seatDepth > p.depth - p.wallThickness
  )
    issue(
      "The seat must fit within both locating walls and the far base edges",
      "seatWidth",
    )
  if (
    p.holeDiameter / 2 >=
    Math.min(p.width / 2, p.depth / 2) - p.wallThickness
  )
    issue(
      "The central fixing hole must leave material before both locating walls",
      "holeDiameter",
    )
  if (
    p.width / 2 - p.wallThickness + p.holeDiameter / 2 > p.seatWidth ||
    p.depth / 2 - p.wallThickness + p.holeDiameter / 2 > p.seatDepth
  )
    issue(
      "The central fixing hole must lie completely within the stated seat",
      "seatWidth",
    )
  if (
    !Number.isFinite(
      8 *
        Math.max(
          p.width,
          p.depth,
          p.height,
          p.wallThickness,
          p.baseThickness,
          p.seatWidth,
          p.seatDepth,
          p.holeDiameter,
        ) **
          3,
    )
  )
    issue("Dimensions exceed finite derived geometry limits", "width")
}
/** Square or rectangular corner foot centered on XY. Base mounting face is Z=0; the supported member sits at Z=baseThickness. Two perpendicular locating walls occupy the negative-X and negative-Y outside edges and reach Z=height. The stated seat starts at their inside corner. One central fixing hole at X=Y=0 passes through the base only. Base thickness defaults to the wall thickness. No rounded exterior or inferred load rating. */
export const cornerFootModelPropsSchema = z
  .object(shape)
  .strict()
  .transform(resolve)
  .superRefine(validate)
export const cornerFootModelDefinitionSchema = z
  .object({ fn: z.literal("cornerfoot"), ...shape })
  .strict()
  .transform(resolve)
  .superRefine(validate)
export type CornerFootModelPropsInput = z.input<
  typeof cornerFootModelPropsSchema
>
export type CornerFootModelProps = z.output<typeof cornerFootModelPropsSchema>
export type CornerFootModelDefinition = z.output<
  typeof cornerFootModelDefinitionSchema
>

/** Normalized millimeter dimensions and installation datums. */
export function getCornerFootDimensions(input: CornerFootModelPropsInput) {
  const p = cornerFootModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.width, p.depth, p.height] as [number, number, number],
    bottomZ: 0,
    topZ: p.height,
    seatMinX: -p.width / 2 + p.wallThickness,
    seatMinY: -p.depth / 2 + p.wallThickness,
    seatMaxX: -p.width / 2 + p.wallThickness + p.seatWidth,
    seatMaxY: -p.depth / 2 + p.wallThickness + p.seatDepth,
    seatZ: p.baseThickness,
    holeCenter: [0, 0, 0] as [number, number, number],
    holeDepth: p.baseThickness,
  }
}
