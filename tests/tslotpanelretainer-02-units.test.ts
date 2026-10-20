import { expect, test } from "bun:test"
import { mp, tSlotPanelRetainerModelPropsSchema } from "../src"
import { props, source } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 2: aliases, case, and mixed length units normalize", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "tslotpanelretainer",
    ...props,
  })
  expect(
    tSlotPanelRetainerModelPropsSchema.parse({ ...props, width: "2.0cm" }),
  ).toEqual(props)
})
