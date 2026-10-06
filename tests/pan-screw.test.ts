import { test } from "bun:test"
import { assertPanScrew } from "./fixtures/assert-pan-screw"

test("panscrew parameter contract", assertPanScrew)
