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
  panelHoleDiameter: positiveLength,
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  height: positiveLength,
  grooveWidth: positiveLength,
  grooveDepth: positiveLength,
  splitWidth: positiveLength,
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  if (
    p.innerDiameter >= p.panelHoleDiameter ||
    p.panelHoleDiameter >= p.outerDiameter
  )
    issue(
      "Diameters must satisfy bore < panel hole < outside diameter",
      "panelHoleDiameter",
    )
  if (p.grooveWidth >= p.height)
    issue("The groove must leave two positive-thickness flanges", "grooveWidth")
  if (
    Math.abs(p.outerDiameter - 2 * p.grooveDepth - p.panelHoleDiameter) >
    1e-9 * p.outerDiameter
  )
    issue(
      "Panel hole diameter must equal OD minus twice the radial groove depth",
      "grooveDepth",
    )
  if (p.splitWidth >= p.innerDiameter)
    issue(
      "The slit must be narrower than the bore to retain the opposite wall",
      "splitWidth",
    )
  if (
    !Number.isFinite(
      8 *
        Math.max(
          p.panelHoleDiameter,
          p.innerDiameter,
          p.outerDiameter,
          p.height,
          p.grooveWidth,
          p.grooveDepth,
          p.splitWidth,
        ) **
          3,
    )
  )
    issue(
      "Dimensions exceed finite derived geometry limits",
      "panelHoleDiameter",
    )
}
/** Split cable protection ring centered on XY and the panel midplane Z=0. A square-shouldered groove occupies Z=-grooveWidth/2 through +grooveWidth/2 and fits the stated panel hole. A constant-width slit opens toward +X from the bore through both flanges. Height spans -height/2 to +height/2; all dimensions are nominal custom geometry. */
export const splitGrommetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const splitGrommetModelDefinitionSchema = z
  .object({ fn: z.literal("splitgrommet"), ...shape })
  .strict()
  .superRefine(validate)
export type SplitGrommetModelPropsInput = z.input<
  typeof splitGrommetModelPropsSchema
>
export type SplitGrommetModelProps = z.output<
  typeof splitGrommetModelPropsSchema
>
export type SplitGrommetModelDefinition = z.output<
  typeof splitGrommetModelDefinitionSchema
>

/** Normalized millimeter dimensions and installation datums. */
export function getSplitGrommetDimensions(input: SplitGrommetModelPropsInput) {
  const p = splitGrommetModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.outerDiameter, p.outerDiameter, p.height] as [
      number,
      number,
      number,
    ],
    bottomZ: -p.height / 2,
    topZ: p.height / 2,
    grooveRootDiameter: p.outerDiameter - 2 * p.grooveDepth,
    flangeThickness: (p.height - p.grooveWidth) / 2,
    grooveStartZ: -p.grooveWidth / 2,
    grooveEndZ: p.grooveWidth / 2,
    slitMinY: -p.splitWidth / 2,
    slitMaxY: p.splitWidth / 2,
    minimumWallThickness: (p.panelHoleDiameter - p.innerDiameter) / 2,
  }
}
