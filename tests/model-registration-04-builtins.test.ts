import { test } from "bun:test"
import { assertSynchronousBuiltins } from "./fixtures/assert-model-registration"

test("model registration builtins", assertSynchronousBuiltins)
