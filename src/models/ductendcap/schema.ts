import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const shape = {
  outerDiameter: positiveLength,
  depth: positiveLength,
  wallThickness: positiveLength,
  skirtInnerDiameter: positiveLength.optional(),
  flatFace: z.literal(true).default(true),
}

type ParsedProps = z.output<z.ZodObject<typeof shape>>

function innerDiameterFromWall(props: ParsedProps) {
  return props.outerDiameter - 2 * props.wallThickness
}

function hasRepresentableRadius(diameter: number) {
  const radius = diameter / 2
  return radius > 0 && 2 * radius === diameter
}

function validate(props: ParsedProps, context: z.RefinementCtx) {
  const innerDiameter = innerDiameterFromWall(props)
  const skirtLength = props.depth - props.wallThickness
  if (!hasRepresentableRadius(props.outerDiameter))
    context.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "The outside diameter must have a positive, representable radius",
    })
  if (skirtLength <= 0 || skirtLength >= props.depth)
    context.addIssue({
      code: "custom",
      path: ["depth"],
      message:
        "The depth must leave space for both the flat face and the skirt",
    })
  if (
    !hasRepresentableRadius(innerDiameter) ||
    innerDiameter >= props.outerDiameter
  ) {
    context.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "The wall must leave a positive opening inside the skirt",
    })
    return
  }

  const suppliedDiameter = props.skirtInnerDiameter
  if (suppliedDiameter === undefined) return
  // Subtracting two near-equal dimensions makes the error depend on the outside diameter.
  const roundoff = 2 * Number.EPSILON * props.outerDiameter
  if (
    !hasRepresentableRadius(suppliedDiameter) ||
    suppliedDiameter >= props.outerDiameter ||
    Math.abs(suppliedDiameter - innerDiameter) > roundoff
  )
    context.addIssue({
      code: "custom",
      path: ["skirtInnerDiameter"],
      message:
        "Skirt inside diameter must equal outside diameter minus two walls",
    })
}

function withSkirtInnerDiameter<T extends ParsedProps>(props: T) {
  return {
    ...props,
    skirtInnerDiameter:
      props.skirtInnerDiameter ?? innerDiameterFromWall(props),
  }
}

export const ductEndCapModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(withSkirtInnerDiameter)
export const ductEndCapModelDefinitionSchema = z
  .object({ fn: z.literal("ductendcap"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(withSkirtInnerDiameter)

export type DuctEndCapModelPropsInput = z.input<
  typeof ductEndCapModelPropsSchema
>
export type DuctEndCapModelProps = z.output<typeof ductEndCapModelPropsSchema>
export type DuctEndCapModelDefinition = z.output<
  typeof ductEndCapModelDefinitionSchema
>

export function getDuctEndCapDimensions(input: DuctEndCapModelPropsInput) {
  const props = ductEndCapModelPropsSchema.parse(input)
  return {
    ...props,
    faceThickness: props.wallThickness,
    skirtLength: props.depth - props.wallThickness,
  }
}
