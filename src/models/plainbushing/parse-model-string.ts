import type { RawModelprinterParams } from "../../parse-model-string"
import { plainBushingModelDefinitionSchema } from "./schema"
import { splitModelStringTokens } from "../../split-model-string-tokens"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
  edgechamfer: "edgeChamfer",
} as const

export function parsePlainBushingModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "plainbushing" || tokens[0]?.toLowerCase() !== "plainbushing")
    throw new Error("Expected plainbushing without an inline value")
  const props: Record<string, unknown> = { fn: "plainbushing" }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid plain bushing token "${token}"`)
    const name = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown
    if (Object.hasOwn(lengths, name)) {
      property = lengths[name as keyof typeof lengths]
      parsed = value
    } else if (name === "style") {
      property = "style"
      const style = value.match(/^\(([a-z]+)\)$/i)
      if (!style) throw new Error("Style requires a parenthesized value")
      parsed = style[1]!.toLowerCase()
    } else throw new Error(`Unknown plain bushing token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(
        `Plain bushing property "${property}" is set more than once`,
      )
    props[property] = parsed
  }
  return plainBushingModelDefinitionSchema.parse(props)
}
