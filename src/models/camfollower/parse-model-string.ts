import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { camFollowerModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  w: "width",
  width: "width",
  studd: "studDiameter",
  studdiameter: "studDiameter",
  studl: "studLength",
  studlength: "studLength",
  threadpitch: "threadPitch",
} as const

export function parseCamFollowerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "camfollower" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected camfollower without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "camfollower" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "needlebearing") {
      property = "needleBearing"
      parsed = true
    } else if (lower === "studmount") {
      property = "studMount"
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
      parsed = token.slice(token.indexOf("(") + 1, -1).toLowerCase()
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown cam follower token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate cam follower property "${property}"`)
    }
    props[property] = parsed
  }
  return camFollowerModelDefinitionSchema.parse(props)
}
