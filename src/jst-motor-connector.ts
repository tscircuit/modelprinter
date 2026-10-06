import { z } from "zod"

/** Representative motor-side headers, in mm. PH preserves the existing
 * BxB-PH profile; SH uses the BMxxB-SRSS profile. Contacts run along local Y,
 * with the mating face at +X and thickness along Z.
 * https://www.jst-mfg.com/product/pdf/eng/ePH.pdf
 * https://www.jst-mfg.com/product/pdf/eng/eSH.pdf
 */
export function getJstMotorConnector(wireConnection: string) {
  const match = /^jst-(ph|sh)-([1-9][0-9]*)$/.exec(wireConnection)
  if (!match) return undefined
  const pinCount = Number(match[2])
  const isPh = match[1] === "ph"
  return {
    standard: isPh ? ("jst_ph" as const) : ("jst_sh" as const),
    pinCount,
    maxPinCount: isPh ? 16 : 15,
    pitch: isPh ? 2 : 1,
    bodyWidth: isPh ? (pinCount - 1) * 2 + 3.9 : pinCount + 3,
    bodyHeight: isPh ? 4.5 : 2.9,
    matingDepth: isPh ? 6 : 4.25,
  }
}

export const jstMotorWireConnectionSchema = z.string().refine((value) => {
  const connector = getJstMotorConnector(value)
  return (
    connector !== undefined &&
    connector.pinCount >= 2 &&
    connector.pinCount <= connector.maxPinCount
  )
}, "Expected jst-ph-N (2–16 pins) or jst-sh-N (2–15 pins)")
