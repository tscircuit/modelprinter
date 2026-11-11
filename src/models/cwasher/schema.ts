import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  thickness: positiveLength,
  gapWidth: positiveLength,
  custom: z.literal(true).default(true),
  parallelCut: z.literal(true).default(true),
  radialOpening: z.literal(true).default(true),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const innerRadius = props.innerDiameter / 2
  const outerRadius = props.outerDiameter / 2
  const halfGapWidth = props.gapWidth / 2

  if (innerRadius <= 0 || innerRadius * 2 !== props.innerDiameter)
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "The bore must have a positive, representable radius",
    })
  if (outerRadius <= innerRadius || outerRadius * 2 !== props.outerDiameter)
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "The outside radius must be greater than the bore radius",
    })
  if (
    halfGapWidth <= 0 ||
    halfGapWidth * 2 !== props.gapWidth ||
    halfGapWidth >= outerRadius
  )
    context.addIssue({
      code: "custom",
      path: ["gapWidth"],
      message: "The opening must be positive and leave material on both sides",
    })
}

export const cWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const cWasherModelDefinitionSchema = z
  .object({ fn: z.literal("cwasher"), ...shape })
  .strict()
  .superRefine(validate)

export type CWasherModelPropsInput = z.input<typeof cWasherModelPropsSchema>
export type CWasherModelProps = z.output<typeof cWasherModelPropsSchema>
export type CWasherModelDefinition = z.output<
  typeof cWasherModelDefinitionSchema
>

export function getCWasherDimensions(input: CWasherModelPropsInput) {
  const props = cWasherModelPropsSchema.parse(input)
  const innerRadius = props.innerDiameter / 2
  const outerRadius = props.outerDiameter / 2
  const halfGapWidth = props.gapWidth / 2
  return {
    ...props,
    innerRadius,
    outerRadius,
    halfGapWidth,
    radialWidth: outerRadius - innerRadius,
    gapSideMargin: outerRadius - halfGapWidth,
  }
}
