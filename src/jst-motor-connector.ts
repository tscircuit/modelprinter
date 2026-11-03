import { z } from "zod"

/** Representative motor-side headers, in mm. PH preserves the existing
 * BxB-PH profile; SH uses the BMxxB-SRSS profile. Contacts run along local Y,
 * with the socket mouth at +X and thickness along Z. matingDepth locates
 * that mouth, not the seated plug tip: subtract plugInsertionDepth for the
 * plug tip plane. The SH contact row is 0.25 mm below the cavity center.
 * https://www.jst-mfg.com/product/pdf/eng/ePH.pdf
 * https://www.jst-mfg.com/product/pdf/eng/eSH.pdf
 */
export function getJstMotorConnector(wireConnection: string | undefined) {
  const match = /^jst-(ph|sh)-([1-9][0-9]*)$/.exec(wireConnection ?? "")
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
    // Representative engagement profiles, with clearance inside the modeled
    // PH/SH header cavities. The full-width plug shoulder stays outside.
    plugInsertionDepth: isPh ? 3.4 : 2.9,
    plugTipWidth: isPh ? (pinCount - 1) * 2 + 2.7 : pinCount + 0.5,
    plugTipHeight: isPh ? 3.1 : 1.6,
    cavityFloorDepth: isPh ? 2.4 : 0.8,
    contactLength: isPh ? 5.5 : 3.45,
    contactOffsetZ: isPh ? 0 : -0.25,
    // BMxxB-SRSS solder tails are behind the internal contact row. Offset
    // from the signal-pad row toward the hold-downs in footprint-local mm.
    pcbContactRowOffset: isPh ? 0 : 1.55,
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
