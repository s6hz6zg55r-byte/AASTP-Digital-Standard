Dataset Structure Standard
Every dataset shall consist of:
schemaVersion
metadata
a single collection property
The collection shall:
have the same semantic name as the dataset (e.g. pes_types, effects, transformations)
contain an array of objects
require each object to have a unique id

| Variable | Meaning |
|----------|---------|
| `neq` | Net Explosive Quantity (kg) |
| `distance` | Separation distance (m) |
| `coefficient` | Formula coefficient |
| `temperature` | Future use |
| `pressure` | Future use |