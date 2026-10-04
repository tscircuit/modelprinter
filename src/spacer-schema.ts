import { z } from "zod"
import { positiveModelLengthSchema } from "./model-length-schema"

const spacerModelPropsShape = {
  innerDiameter: positiveModelLengthSchema.default(3.2),
  outerDiameter: positiveModelLengthSchema.default(6),
  length: positiveModelLengthSchema.default(10),
}

const validateSpacerDimensions = (
  spacer: { innerDiameter: number; outerDiameter: number },
  context: z.RefinementCtx,
) => {
  if (spacer.innerDiameter >= spacer.outerDiameter) {
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Spacer inner diameter must be less than its outer diameter",
    })
  }
}

export const spacerModelPropsSchema = z
  .object(spacerModelPropsShape)
  .strict()
  .superRefine(validateSpacerDimensions)

export const spacerModelDefinitionSchema = z
  .object({ fn: z.literal("spacer"), ...spacerModelPropsShape })
  .strict()
  .superRefine(validateSpacerDimensions)

export type SpacerModelPropsInput = z.input<typeof spacerModelPropsSchema>
export type SpacerModelProps = z.output<typeof spacerModelPropsSchema>
export type SpacerModelDefinition = z.infer<typeof spacerModelDefinitionSchema>
