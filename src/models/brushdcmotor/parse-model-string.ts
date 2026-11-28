import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { brushDcMotorModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
  shaftd: "shaftDiameter",
  shaftdiameter: "shaftDiameter",
  shaftl: "shaftLength",
  shaftlength: "shaftLength",
  pcd: "pitchCircleDiameter",
  boltpcd: "pitchCircleDiameter",
  pitchcirclediameter: "pitchCircleDiameter",
  threadpitch: "threadPitch",
} as const

export function parseBrushDcMotorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "brushdcmotor" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected brushdcmotor without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "brushdcmotor" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "face2hole") {
      property = "face2Hole"
      parsed = true
    } else if (lower === "roundcan") {
      property = "roundCan"
      parsed = true
    } else if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (lower === "threads" || lower === "nothreads") {
      property = "showThreads"
      parsed = lower === "threads"
    } else if (/^m\d+(?:\.\d+)?$/i.test(token)) {
      property = "metricSize"
      parsed = `M${token.slice(1)}`
    } else if (/^threadclass\([^()]+\)$/i.test(token)) {
      property = "threadClass"
      parsed = token.slice(token.indexOf("(") + 1, -1).toUpperCase()
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown brushed DC motor token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate brushed DC motor property "${property}"`)
    }
    props[property] = parsed
  }
  return brushDcMotorModelDefinitionSchema.parse(props)
}
