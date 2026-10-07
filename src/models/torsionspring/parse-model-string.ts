import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { torsionSpringModelDefinitionSchema } from "./schema"
const lengths = {
  od: "outerDiameter",
  wire: "wireDiameter",
  pitch: "pitch",
  start: "startLegLength",
  end: "endLegLength",
} as const
export function parseTorsionSpringModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "torsionspring" ||
    tokens[0]?.toLowerCase() !== "torsionspring"
  )
    throw new Error("Expected torsionspring without an inline value")
  const props: Record<string, unknown> = { fn: "torsionspring" }
  for (const token of tokens.slice(1)) {
    const flag = token.toLowerCase()
    if (flag === "left" || flag === "right") {
      if ("leftHand" in props)
        throw new Error("Duplicate or conflicting spring handedness")
      props.leftHand = flag === "left"
      continue
    }
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase(),
      value = match?.[2]
    if (!name || !value)
      throw new Error(`Invalid torsion spring token "${token}"`)
    let property: string,
      parsed: unknown = value
    if (name in lengths) property = lengths[name as keyof typeof lengths]
    else if (name === "turns") {
      property = "turns"
      if (!/^[+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))
        throw new Error("Turns requires a unitless number")
      parsed = Number(value)
    } else throw new Error(`Unknown torsion spring token "${token}"`)
    if (property in props)
      throw new Error(`Duplicate torsion spring property "${property}"`)
    props[property] = parsed
  }
  return torsionSpringModelDefinitionSchema.parse(props)
}
