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

const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  length: positiveLength,
  /** Width between the parallel slit walls. */
  gap: positiveLength,
  plainSplit: z.literal(true).default(true),
  edgeChamfer: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function sectionDimensions(props: ResolvedProps) {
  const chamferDiameter = 2 * props.edgeChamfer
  const endInnerDiameter = props.innerDiameter + chamferDiameter
  const endOuterDiameter = props.outerDiameter - chamferDiameter
  return {
    wallThickness: (props.outerDiameter - props.innerDiameter) / 2,
    endInnerDiameter,
    endOuterDiameter,
    endWallThickness: (endOuterDiameter - endInnerDiameter) / 2,
    straightLength: props.length - chamferDiameter,
  }
}

function hasPositiveHalf(value: number) {
  const half = value / 2
  return half > 0 && 2 * half === value
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const dimensions = sectionDimensions(props)
  const issue = (message: string, property: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", path: [property], message })

  if (!hasPositiveHalf(props.innerDiameter))
    issue(
      "Bore diameter must have a positive, representable radius",
      "innerDiameter",
    )
  if (!hasPositiveHalf(props.outerDiameter) || dimensions.wallThickness <= 0)
    issue(
      "Outside diameter must leave positive radial wall thickness",
      "outerDiameter",
    )
  if (!hasPositiveHalf(props.gap) || props.gap >= props.innerDiameter)
    issue("The slit must be positive and narrower than the bore", "gap")
  if (
    dimensions.wallThickness > 0 &&
    (2 * props.edgeChamfer >= dimensions.wallThickness ||
      dimensions.endWallThickness <= 0 ||
      !hasPositiveHalf(dimensions.endInnerDiameter) ||
      !hasPositiveHalf(dimensions.endOuterDiameter))
  )
    issue(
      "Inner and outer chamfers must leave positive end-wall thickness",
      "edgeChamfer",
    )
  if (dimensions.straightLength <= 0)
    issue(
      "The end chamfers must leave positive straight bore length",
      "edgeChamfer",
    )
}

export const splitBushingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const splitBushingModelDefinitionSchema = z
  .object({ fn: z.literal("splitbushing"), ...shape })
  .strict()
  .superRefine(validate)

export type SplitBushingModelPropsInput = z.input<
  typeof splitBushingModelPropsSchema
>
export type SplitBushingModelProps = z.output<
  typeof splitBushingModelPropsSchema
>
export type SplitBushingModelDefinition = z.output<
  typeof splitBushingModelDefinitionSchema
>

/** Millimeter dimensions of a sleeve centered on XY with ends at Z=0 and
 * Z=length. The constant-width slit opens along +X and spans the whole length.
 */
export function getSplitBushingDimensions(input: SplitBushingModelPropsInput) {
  const props = splitBushingModelPropsSchema.parse(input)
  return {
    ...props,
    ...sectionDimensions(props),
    bottomZ: 0,
    topZ: props.length,
  }
}
