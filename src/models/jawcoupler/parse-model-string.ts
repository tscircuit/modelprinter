import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { jawCouplerModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  bored: "boreDiameter",
  borediameter: "boreDiameter",
  boreb: "boreBDiameter",
  borebdiameter: "boreBDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
  threadpitch: "threadPitch",
} as const

export function parseJawCouplerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "jawcoupler" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected jawcoupler without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "jawcoupler" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "curvedjaw") {
      property = "curvedJaw"
      parsed = true
    } else if (lower === "setscrew") {
      property = "setScrew"
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
      } else if (tokenName === "jaws" || tokenName === "jawcount") {
        property = "jawCount"
        parsed = parseGearInteger(tokenArg, "jawCount")
      } else {
        throw new Error(`Unknown jaw coupler token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate jaw coupler property "${property}"`)
    }
    props[property] = parsed
  }
  return jawCouplerModelDefinitionSchema.parse(props)
}
