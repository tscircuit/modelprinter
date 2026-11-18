import { parsePneumaticModelParams } from "../../pneumatic-model-params"
import type { RawModelprinterParams } from "../../parse-model-string"
import { airDirectionalValveModelDefinitionSchema } from "./schema"

export function parseAirDirectionalValveModelParams(
  raw: RawModelprinterParams,
) {
  return airDirectionalValveModelDefinitionSchema.parse(
    parsePneumaticModelParams(
      raw,
      "airdirectionalvalve",
      {
        l: "length",
        w: "width",
        h: "height",
        portheight: "portHeight",
        coilod: "coilDiameter",
        mountpitch: "mountPitch",
      },
      {
        port: "portThread",
        inlet: "inletThread",
        work: "workThread",
        exhaust: "exhaustThread",
        flow: "flow",
      },
      {
        ventedcap: "ventedCap",
        radialleads: "radialLeads",
        block: ["bodyStyle", "block"],
        round: ["bodyStyle", "round"],
        solenoid: ["actuator", "solenoid"],
        manual: ["actuator", "manual"],
        airpilot: ["actuator", "airpilot"],
        springreturn: ["returnType", "springreturn"],
        doublesolenoid: ["returnType", "doublesolenoid"],
        normallyclosed: ["normalPosition", "normallyclosed"],
        normallyopen: ["normalPosition", "normallyopen"],
        closedcenter: ["center", "closedcenter"],
        exhaustcenter: ["center", "exhaustcenter"],
        pressurecenter: ["center", "pressurecenter"],
      },
    ),
  )
}
