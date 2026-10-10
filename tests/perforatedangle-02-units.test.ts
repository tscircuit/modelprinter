import { expect, test } from "bun:test"
import { mp, perforatedAngleModelPropsSchema } from "../src"
import { props, source } from "./fixtures/perforatedangle"
test("perforatedangle 2: aliases, case, and mixed length units normalize", () => {
  expect(mp.string(source.toUpperCase()).json()).toEqual({
    fn: "perforatedangle",
    ...props,
  })
  expect(
    perforatedAngleModelPropsSchema.parse({ ...props, width: "2.5cm" }),
  ).toEqual(props)
})
