# Mechanical model string flags

Prefer value-free flags for mechanical options. For models other than
`threadedrod`, these aliases preserve the released JSON schema and legacy raw
`.params()`. Their new flag strings are validated during `.string()`; legacy
strings retain deferred model validation during `.json()`.

`threadedrod` uses `leftHand: boolean` and omits the fixed `spec`, `thread`, and
`ends` JSON fields. It validates and normalizes both legacy selectors and flags
during `.string()`. See [Threaded rod](threaded-rods.md) for its props migration.

| Legacy selector | Preferred syntax | Models |
| --- | --- | --- |
| `mount(setscrew)` | `_setscrew` | shaftcollar, rigidcoupler |
| `mount(singleclamp)` | `_singleclamp` | clampingshaftcollar |
| `threadhand(left)` | `_lefthanded` | threadedrod, shaftcollar, clampingshaftcollar, rigidcoupler, hexbolt, flatheadscrew, panscrew |
| `hand(left)` | `_lefthanded` | compressionspring |
| `ends(closedground)` | `_closedground` | compressionspring |
| `thread(full)` | Omit | threadedrod |
| `thread(full)` | `_fullthread` | hexbolt, flatheadscrew, panscrew, buttonscrew |
| `drive(hex)` | `_hex` | hexbolt |
| `drive(hexsocket)` | `_hexsocket` | flatheadscrew, buttonscrew |
| `drive(phillips)` | `_phillips` | panscrew |
| `profile(fourtsolid)` | `_fourtsolid` | tslotextrusion |
| `shape(righttriangle)` | `_righttriangle` | tslotgusset |
| `shape(symmetricring)` | `_symmetricring` | cablegrommet |

Omit redundant default selectors: `spec(custom)`, `state(free)`,
`style(plainclosed)`, `ends(flat)`, right handedness and male thread gender.
The corresponding `_custom`, `_free`, `_plainclosed`, `_flatends`,
`_righthanded` and `_male` aliases are accepted only in applicable models and
removed when normalizing flag syntax. All existing default values remain intact.
For `threadedrod`, `_fullthread` also normalizes away because full threading is
the model's fixed construction.
Dimensions and identifiers such as `standard(iso4017:2014)`, `m6`, and
`threadclass(6H)` retain their established syntax. Existing thread visibility
flags `_threads` and `_nothreads` continue to work.

For example:

```ts
mp.string("shaftcollar_bore8mm_od16mm_w8mm_setscrew_m4_lefthanded").json()
mp.string("compressionspring_od8mm_wire1mm_l20mm_turns8_closedground_lefthanded").json()
mp.string("plainbushing_id8mm_od12mm_l20mm").json()
mp.string("threadedrod_m6_l100mm_lefthanded").json()
```

Flags are case insensitive, model-local and value-free. Repeating a flag or
combining it with a selector for the same property is an error, even if they
agree. Unsupported options remain unsupported; these aliases do not add new
geometry variants. New models should use boolean JSON properties for options
from the outset; aliases on other released models preserve their existing JSON
API.
