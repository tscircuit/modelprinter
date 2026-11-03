import { expect, test } from "bun:test"
import { getJstMotorConnector } from "../src"

test("PH/SH distinguish the socket mouth from the seated plug tip", () => {
  for (const family of ["ph", "sh"]) {
    for (const pins of [2, 6, family === "ph" ? 16 : 15]) {
      const header = getJstMotorConnector(`jst-${family}-${pins}`)!
      const tip = header.matingDepth - header.plugInsertionDepth
      expect(tip).toBeGreaterThan(header.cavityFloorDepth)
      expect(tip).toBeLessThan(header.contactLength)
      expect(header.plugTipWidth).toBeLessThan(header.bodyWidth)
      expect(header.plugTipHeight).toBeLessThan(header.bodyHeight)
      expect(header.pcbContactRowOffset).toBe(family === "ph" ? 0 : 1.55)
    }
  }
})
