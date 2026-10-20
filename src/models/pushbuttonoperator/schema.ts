import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positive = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegative = industrialLengthSchema.refine(
  (value) => value >= 0,
  "Length must be nonnegative",
)
const shape = {
  panelDiameter: positive.default(22),
  bezelDiameter: positive.default(30),
  buttonDiameter: positive.default(22),
  bodyLength: positive.default(35),
  buttonHeight: positive.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.panelDiameter >= p.bezelDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible pushbuttonoperator dimensions: 1",
    })
  if (p.buttonDiameter >= p.bezelDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible pushbuttonoperator dimensions: 2",
    })
  if (p.bodyLength <= p.buttonHeight)
    context.addIssue({
      code: "custom",
      message: "Incompatible pushbuttonoperator dimensions: 3",
    })
}
export const pushbuttonOperatorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const pushbuttonOperatorModelDefinitionSchema = z
  .object({ fn: z.literal("pushbuttonoperator"), ...shape })
  .strict()
  .superRefine(validate)
export type PushbuttonOperatorModelPropsInput = z.input<
  typeof pushbuttonOperatorModelPropsSchema
>
export type PushbuttonOperatorModelProps = z.output<
  typeof pushbuttonOperatorModelPropsSchema
>
export type PushbuttonOperatorModelDefinition = z.output<
  typeof pushbuttonOperatorModelDefinitionSchema
>
/** Panel pushbutton operator with nominal mounting barrel, bezel, circular plunger and two rear terminal tabs. The panel is at Z=bodyLength, the actuator faces +Z, and terminals project below Z=0. No contact rating is implied. All normalized lengths are millimeters. */
export function getPushbuttonOperatorDimensions(
  input: PushbuttonOperatorModelPropsInput = {},
) {
  const p = pushbuttonOperatorModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.bezelDiameter,
      p.bezelDiameter,
      p.bodyLength + p.buttonHeight + 7,
    ] as [number, number, number],
  }
}
