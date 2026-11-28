import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)

const positiveLength = length.refine((value) => value > 0, {
  message: "Shaft dimension must be positive",
})
const nonnegativeLength = length.refine((value) => value >= 0, {
  message: "End chamfer must be non-negative",
})

const shape = {
  /** Solid cylindrical guide or drive shaft contract. */
  roundSolid: z.literal(true).default(true),
  /** Outer cylindrical diameter in millimeters. */
  diameter: positiveLength,
  /** Overall distance between the two flat end planes, including end chamfers. */
  length: positiveLength,
  /** Equal axial and radial setbacks of the two 45-degree end chamfers. */
  endChamfer: nonnegativeLength.default(0),
}

type RawProps = z.output<z.ZodObject<typeof shape>>

function validate(props: RawProps, context: z.RefinementCtx) {
  if (props.endChamfer >= Math.min(props.diameter / 2, props.length / 2)) {
    context.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message:
        "End chamfer must leave flat end faces and separate end chamfers",
    })
  }
}

export const shaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const shaftModelDefinitionSchema = z
  .object({ fn: z.literal("shaft"), ...shape })
  .strict()
  .superRefine(validate)

export type ShaftModelPropsInput = z.input<typeof shaftModelPropsSchema>
export type ShaftModelProps = z.output<typeof shaftModelPropsSchema>
export type ShaftModelDefinition = z.output<typeof shaftModelDefinitionSchema>

/** Nominal cylindrical shaft envelope; lower end Z=0, upper end Z=length. */
export function getShaftDimensions(input: ShaftModelPropsInput) {
  const props = shaftModelPropsSchema.parse(input)
  return {
    ...props,
    endDiameter: props.diameter - 2 * props.endChamfer,
    bearingZ: 0,
    topZ: props.length,
  }
}
