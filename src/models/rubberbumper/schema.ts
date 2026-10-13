import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positiveLength = industrialLengthSchema.refine(
  (value) => value >= 0.01,
  "Length must be at least 0.01 mm",
)
const shape = {
  diameter: positiveLength.default(30),
  height: positiveLength.default(15),
  holeDiameter: positiveLength.default(6),
  counterboreDiameter: positiveLength.default(13),
  counterboreDepth: positiveLength.default(5),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (!(p.holeDiameter < p.counterboreDiameter))
    context.addIssue({
      code: "custom",
      message:
        "Invalid rubberbumper dimensions: holeDiameter < counterboreDiameter",
    })
  if (!(p.counterboreDiameter < p.diameter * 0.8))
    context.addIssue({
      code: "custom",
      message:
        "Invalid rubberbumper dimensions: counterboreDiameter < diameter*.8",
    })
  if (!(p.counterboreDepth < p.height))
    context.addIssue({
      code: "custom",
      message: "Invalid rubberbumper dimensions: counterboreDepth < height",
    })
  if (!(p.height < p.diameter))
    context.addIssue({
      code: "custom",
      message: "Invalid rubberbumper dimensions: height < diameter",
    })
}
export const rubberBumperModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const rubberBumperModelDefinitionSchema = z
  .object({ fn: z.literal("rubberbumper"), ...shape })
  .strict()
  .superRefine(validate)
export type RubberBumperModelPropsInput = z.input<
  typeof rubberBumperModelPropsSchema
>
export type RubberBumperModelProps = z.output<
  typeof rubberBumperModelPropsSchema
>
export type RubberBumperModelDefinition = z.output<
  typeof rubberBumperModelDefinitionSchema
>
/** Cylindrical bumper with axial through bore and top counterbore, axis Z. All lengths normalize to millimeters. Nominal geometry; no vendor, fit or standard compliance is implied. */
export function getRubberBumperDimensions(
  input: RubberBumperModelPropsInput = {},
) {
  return rubberBumperModelPropsSchema.parse(input)
}
