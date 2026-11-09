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
  thickness: positiveLength,
  flatDepth: positiveLength,
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const innerRadius = props.innerDiameter / 2
  const outerRadius = props.outerDiameter / 2
  if (innerRadius <= 0 || 2 * innerRadius !== props.innerDiameter)
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Bore diameter must have a positive, representable radius",
    })
  if (outerRadius <= innerRadius || 2 * outerRadius !== props.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Outside diameter must have a representable radius greater than the bore radius",
    })
  } else {
    const flatX = outerRadius - props.flatDepth
    if (flatX <= innerRadius || flatX >= outerRadius)
      context.addIssue({
        code: "custom",
        path: ["flatDepth"],
        message:
          "The flat must cut the outside circle and leave material outside the bore",
      })
  }
}

export const dWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const dWasherModelDefinitionSchema = z
  .object({ fn: z.literal("dwasher"), ...shape })
  .strict()
  .superRefine(validate)

export type DWasherModelPropsInput = z.input<typeof dWasherModelPropsSchema>
export type DWasherModelProps = z.output<typeof dWasherModelPropsSchema>
export type DWasherModelDefinition = z.output<
  typeof dWasherModelDefinitionSchema
>

/** Center the bore and nominal disk on XY. The flat cuts the +X side and
 * the parallel end planes are at Z=0 and Z=thickness.
 */
export function getDWasherDimensions(input: DWasherModelPropsInput) {
  const props = dWasherModelPropsSchema.parse(input)
  const innerRadius = props.innerDiameter / 2
  const outerRadius = props.outerDiameter / 2
  const flatX = outerRadius - props.flatDepth
  // Factored and scaled chord length avoids squaring the outside radius.
  const flatLength =
    props.outerDiameter *
    Math.sqrt(((outerRadius - flatX) / outerRadius) * (1 + flatX / outerRadius))
  return {
    ...props,
    flatX,
    flatLength,
    wallAtFlat: flatX - innerRadius,
    size: [outerRadius + flatX, props.outerDiameter, props.thickness] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-outerRadius, -outerRadius, 0] as [number, number, number],
      max: [flatX, outerRadius, props.thickness] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.thickness,
  }
}
