import { expect, test } from "bun:test"
import {
  busbarCoverModelPropsSchema,
  getBusbarCoverDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("busbarcover resolves 100mm 30x20mm inward-lip shroud", () => {
  const parsed = parseModelString(
    "busbarcover_l100mm_iw30mm_ih20mm_t2mm_lip2mm_inwarduchannel",
  )
  expect(parsed).toEqual({
    fn: "busbarcover",
    length: 100,
    innerWidth: 30,
    innerHeight: 20,
    thickness: 2,
    lipWidth: 2,
    inwardUChannel: true,
  })
  expect(getBusbarCoverDimensions().entrySlotWidth).toBe(26)
})

test("busbarcover supports 250mm cover variant and schema roundtrip", () => {
  const parsed = parseModelString("busbarcover_l250mm_iw40mm_lip3mm")
  expect(parsed.fn).toBe("busbarcover")
  if (parsed.fn !== "busbarcover") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(busbarCoverModelPropsSchema.parse({}).inwardUChannel).toBe(true)
})

test("busbarcover rejects legacy selectors and closed-off lips", () => {
  expect(() => parseModelString("busbarcover_shape(inwarduchannel)")).toThrow()
  expect(() => parseModelString("busbarcover_iw20mm_lip10mm")).toThrow()
})
