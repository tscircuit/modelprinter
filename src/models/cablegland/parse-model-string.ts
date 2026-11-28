import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cableGlandModelDefinitionSchema } from "./schema"

const lengths = {
  threadpitch: "threadPitch",
  pitch: "threadPitch",
  cable: "cableDiameter",
  cablediameter: "cableDiameter",
  barrell: "barrelLength",
  barrellength: "barrelLength",
  h: "height",
  height: "height",
  hex: "hexWidth",
  hexwidth: "hexWidth",
  capod: "capOuterDiameter",
  capouterdiameter: "capOuterDiameter",
} as const

export function parseCableGlandModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "cablegland" || !/^cablegland$/i.test(tokens[0] ?? "")) {
    throw new Error("Expected cablegland without an inline value")
  }

  const props: Record<string, unknown> = { fn: "cablegland" }
  const seen = new Set<string>()

  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2] ?? ""
    if (!name) {
      throw new Error(`Invalid cable gland token "${token}"`)
    }

    let property: string
    let parsed: unknown = value

    if (name === "m") {
      property = "metricSize"
      if (!/^\d+(?:\.\d+)?$/.test(value)) {
        throw new Error("Metric size must be a unitless thread diameter")
      }
      parsed = `M${value}`
    } else if (name === "compression") {
      property = "compression"
      if (value !== "") {
        throw new Error("compression is a value-free flag")
      }
      parsed = true
    } else if (Object.hasOwn(lengths, name)) {
      property = lengths[name as keyof typeof lengths]
    } else {
      throw new Error(`Unknown cable gland token "${token}"`)
    }

    if (seen.has(property)) {
      throw new Error(`Duplicate cable gland property "${property}"`)
    }
    seen.add(property)
    props[property] = parsed
  }

  return cableGlandModelDefinitionSchema.parse(props)
}
