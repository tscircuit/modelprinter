import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { levelingFootModelDefinitionSchema } from "./schema"

const lengths = {
  od: "padDiameter",
  paddiameter: "padDiameter",
  outerdiameter: "padDiameter",
  padh: "padHeight",
  padheight: "padHeight",
  steml: "stemLength",
  stemlength: "stemLength",
  threadpitch: "threadPitch",
} as const

export function parseLevelingFootModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "levelingfoot" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected levelingfoot without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "levelingfoot" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "flatbase") {
      property = "flatBase"
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
    } else if (/^swivel([+-]?\d+(?:\.\d+)?)(?:deg)?$/i.test(token)) {
      const angleMatch = token.match(/^swivel([+-]?\d+(?:\.\d+)?)(?:deg)?$/i)
      property = "swivelAngle"
      parsed = Number(angleMatch?.[1] ?? NaN)
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown leveling foot token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate leveling foot property "${property}"`)
    }
    props[property] = parsed
  }
  return levelingFootModelDefinitionSchema.parse(props)
}
