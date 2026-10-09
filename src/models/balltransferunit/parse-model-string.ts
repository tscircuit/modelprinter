import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballTransferUnitModelDefinitionSchema } from "./schema"

const lengths = {
  balld: "ballDiameter",
  balldiameter: "ballDiameter",
  bodyod: "bodyDiameter",
  bodydiameter: "bodyDiameter",
  h: "height",
  height: "height",
  ballprotrusion: "ballProtrusion",
  flangeod: "flangeDiameter",
  flangediameter: "flangeDiameter",
  flangethickness: "flangeThickness",
  pcd: "pitchCircleDiameter",
  pitchcirclediameter: "pitchCircleDiameter",
  holed: "holeDiameter",
  holediameter: "holeDiameter",
  socketclearance: "socketClearance",
} as const

export function parseBallTransferUnitModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "balltransferunit" ||
    tokens[0]?.toLowerCase() !== "balltransferunit"
  )
    throw new Error("Expected balltransferunit without an inline value")
  const props: Record<string, unknown> = { fn: "balltransferunit" }
  for (const token of tokens.slice(1)) {
    const lower = token.toLowerCase()
    let property: string
    let value: unknown
    if (lower === "face3hole" || lower === "mount(face3hole)") {
      property = "faceThreeHole"
      value = true
    } else {
      const match = token.match(/^([a-z]+)(.*)$/i)
      const name = match?.[1]?.toLowerCase() ?? ""
      if (!Object.hasOwn(lengths, name))
        throw new Error(`Unknown balltransferunit token "${token}"`)
      property = lengths[name as keyof typeof lengths]
      value = match![2]!
      if (!value) throw new Error(`Token "${name}" requires a length`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate balltransferunit property "${property}"`)
    props[property] = value
  }
  return ballTransferUnitModelDefinitionSchema.parse(props)
}
