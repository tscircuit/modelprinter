import { test } from "bun:test"
import { assertStandoffs } from "./fixtures/assert-standoff"

test("female and male-female hex standoff parameter contracts", assertStandoffs)
