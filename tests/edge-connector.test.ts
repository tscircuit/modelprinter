import { expect, test } from "bun:test"
import {
  edgeConnectorModelPropsSchema,
  getEdgeConnectorDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("edgeconnector resolves 20-contact 2.54mm card-edge receptacle", () => {
  const parsed = parseModelString(
    "edgeconnector_p2.54mm_contacts20_rows2_board1.6mm_l35mm_h12mm_d8mm_throughhole_topslot",
  )
  expect(parsed).toEqual({
    fn: "edgeconnector",
    pitch: 2.54,
    contacts: 20,
    rows: 2,
    boardThickness: 1.6,
    length: 35,
    height: 12,
    depth: 8,
    throughHole: true,
    topSlot: true,
  })
  expect(getEdgeConnectorDimensions().positionsPerSide).toBe(10)
})

test("edgeconnector supports 44-contact variant and schema roundtrip", () => {
  const parsed = parseModelString("edgeconnector_contacts44_l66mm")
  expect(parsed.fn).toBe("edgeconnector")
  if (parsed.fn !== "edgeconnector") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(edgeConnectorModelPropsSchema.parse({}).topSlot).toBe(true)
})

test("edgeconnector rejects legacy selectors and odd contact counts", () => {
  expect(() =>
    parseModelString("edgeconnector_mount(throughhole)_slot(top)"),
  ).toThrow()
  expect(() => parseModelString("edgeconnector_contacts21_l40mm")).toThrow()
})
