import { z } from "zod"
import {
  positiveLength,
  nonnegativeLength,
  pneumaticThread,
} from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  portHeight: nonnegativeLength.optional(),
  coilDiameter: positiveLength.optional(),
  mountPitch: positiveLength.optional(),
  portThread: pneumaticThread,
  inletThread: pneumaticThread.optional(),
  workThread: pneumaticThread.optional(),
  exhaustThread: pneumaticThread.optional(),
  flow: z.enum(["2/2", "3/2", "5/2", "5/3"]),
  bodyStyle: z.enum(["block", "round"]).default("block"),
  actuator: z.enum(["solenoid", "manual", "airpilot"]).default("solenoid"),
  returnType: z.enum(["springreturn", "doublesolenoid"]).optional(),
  normalPosition: z.enum(["normallyclosed", "normallyopen"]).optional(),
  center: z
    .enum(["closedcenter", "exhaustcenter", "pressurecenter"])
    .optional(),
  ventedCap: z.boolean().default(false),
  radialLeads: z.boolean().default(false),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.flow === "5/3" ? p.center !== undefined : p.center === undefined)) {
    context.addIssue({
      code: "custom",
      message: "Specify a center selector only for 5/3 valves",
    })
  }
  if (
    !(p.normalPosition === undefined || p.flow === "2/2" || p.flow === "3/2")
  ) {
    context.addIssue({
      code: "custom",
      message:
        "A normally-open or normally-closed selector requires 2/2 or 3/2 flow",
    })
  }
  if (
    !(
      !p.ventedCap ||
      (p.bodyStyle === "round" && p.flow === "3/2" && !p.exhaustThread)
    )
  ) {
    context.addIssue({
      code: "custom",
      message:
        "A vented cap requires a round 3/2 valve without a threaded exhaust",
    })
  }
  if (!(p.bodyStyle !== "round" || p.flow === "2/2" || p.flow === "3/2")) {
    context.addIssue({
      code: "custom",
      message: "Round bodies support 2/2 and 3/2 flow",
    })
  }
  if (!(p.portHeight === undefined || p.portHeight < p.height)) {
    context.addIssue({
      code: "custom",
      message: "Port height must be below the top of the body",
    })
  }
  if (
    !(
      p.coilDiameter === undefined ||
      (p.bodyStyle === "round" && p.coilDiameter <= Math.min(p.length, p.width))
    )
  ) {
    context.addIssue({
      code: "custom",
      message: "Coil diameter requires a round body and must fit the envelope",
    })
  }
  if (!(p.mountPitch === undefined || p.mountPitch < p.length)) {
    context.addIssue({
      code: "custom",
      message: "Mount pitch must fit the body",
    })
  }
  if (
    !(
      (p.returnType !== "doublesolenoid" && !p.radialLeads) ||
      p.actuator === "solenoid"
    )
  ) {
    context.addIssue({
      code: "custom",
      message: "Double solenoids and radial leads require solenoid actuation",
    })
  }
}

export const airDirectionalValveModelPropsSchema =
  propsSchema.superRefine(validate)
export const airDirectionalValveModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airdirectionalvalve") })
  .superRefine(validate)
export type AirDirectionalValveModelPropsInput = z.input<
  typeof airDirectionalValveModelPropsSchema
>
export type AirDirectionalValveModelProps = z.output<
  typeof airDirectionalValveModelPropsSchema
>
export type AirDirectionalValveModelDefinition = z.output<
  typeof airDirectionalValveModelDefinitionSchema
>
