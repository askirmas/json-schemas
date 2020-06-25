import {props_units as properties} from "../build/css/terms.json"

type S = Set<string>
type R<X = S> = Record<string, X>

const props = new Set(properties)
, usage: R = {}
, siblings: R = {}
// , siblingAreas: RS = {}
, unique: R = {}
, singles: S = new Set()
, positions: R = {}
, positioned: R = {}
, positionAreas: R = {}

for (const property of props) {
  const chunks = property.split('-').filter(Boolean)
  , {length} = chunks

  for (let i = length; i--;) {
    const term = chunks[i]
    , pos = `${i + 1}/${length}`
    , sibls = (
      siblings[term] = siblings[term] ?? new Set(),
      siblings[term]
    )

    positions[pos] = (positions[pos] ?? new Set()).add(term)
    positioned[term] = (positioned[term] ?? new Set()).add(pos)
    usage[term] = (usage[term] ?? new Set()).add(property)

    chunks.forEach(sib => sibls.add(sib))
  }
}

// Singles
for (const property of props) {
  const chunks = property.split('-').filter(Boolean)

  if (!chunks.every(term => usage[term]?.size === 1))
    continue
  
  singles.add(property)
  chunks.forEach(term => {
    delete usage[term]
    delete siblings[term]
    delete positioned[term]
  })
}

// Uniques 
for (const term in usage) {
  const used = usage[term]
  if (used.size === 1) {
    const prop = [...used][0]
    unique[prop] = (unique[prop] ?? new Set()).add(term)
    delete usage[term]
    delete siblings[term]
    delete positioned[term]
  }
}

for (const term in positioned) {
  const poses = [...positioned[term]].sort().join(', ')
  positionAreas[poses] = (positionAreas[poses] ?? new Set()).add(term)
}

// for (const term in siblings) {
//   const area = [...siblings[term]]
//   .sort()
//   .join('-')

//   siblingAreas[area] = (siblingAreas[area] ?? new Set()).add(term)
// }

console.log(JSON.stringify({
  positionStats: Object.entries(positionAreas)
  .sort(([k1], [k2]) => k1 === k2 ? 0 : k1 > k2 ? 1 : -1),
  singles,
  unique,
  usage,
  // siblingAreas: Object.values(siblingAreas).filter(l => l.size > 1),
  siblings,
  positions,
  positioned,
  positionAreas
}, (_, v) => v instanceof Set ? [...v] : v, 2))