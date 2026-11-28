import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pcbMountingTrayModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
  wallt: "wallThickness",
  wallthickness: "wallThickness",
  bossod: "bossOuterDiameter",
  bossouterdiameter: "bossOuterDiameter",
  bossid: "bossInnerDiameter",
  bossinnerdiameter: "bossInnerDiameter",
  bossh: "bossHeight",
  bossheight: "bossHeight",
} as const

export function parsePcbMountingTrayModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "pcbmountingtray" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected pcbmountingtray without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "pcbmountingtray" }
  for (const token of tokens.slice(1)) {
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown
    if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length argument in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    } else if (tokenName === "ears" || tokenName === "earcount") {
      property = "earCount"
      parsed = parseGearInteger(tokenArg, "earCount")
    } else if (tokenName === "hp" || tokenName === "holepattern") {
      const tupleMatch = tokenArg.match(/^\(([^(),]+),([^(),]+)\)$/)
      if (!tupleMatch) {
        throw new Error("hp requires two parenthesized lengths")
      }
      const [, hpX = "", hpY = ""] = tupleMatch
      property = "holePattern"
      parsed = [hpX.trim(), hpY.trim()]
    } else {
      throw new Error(`Unknown PCB mounting tray token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate PCB mounting tray property "${property}"`)
    }
    props[property] = parsed
  }
  return pcbMountingTrayModelDefinitionSchema.parse(props)
}
