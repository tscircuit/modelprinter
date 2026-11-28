import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pipeBlindFlangeModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  t: "thickness",
  boltcirc: "boltCircleDiameter",
  holed: "holeDiameter",
} as const

export function parsePipeBlindFlangeModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "pipeblindflange" ||
    tokens[0]?.toLowerCase() !== "pipeblindflange"
  ) {
    throw new Error("Expected pipeblindflange without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pipeblindflange" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pipeblindflange`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "flatface") {
      if (Object.hasOwn(props, "flatFace")) {
        throw new Error("Duplicate pipeblindflange flatface flag")
      }
      props.flatFace = true
      continue
    }
    if (lower === "solidcenter") {
      if (Object.hasOwn(props, "solidCenter")) {
        throw new Error("Duplicate pipeblindflange solidcenter flag")
      }
      props.solidCenter = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "holes") {
      if (!tokenArg) throw new Error(`Missing hole count in "${token}"`)
      if (Object.hasOwn(props, "holes")) {
        throw new Error("Duplicate pipeblindflange holes")
      }
      props.holes = parseGearInteger(tokenArg, "holes")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate pipeblindflange property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown pipeblindflange token "${token}"`)
    }
  }
  return pipeBlindFlangeModelDefinitionSchema.parse(props)
}
