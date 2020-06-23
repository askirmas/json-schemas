import data from "../docs/mdn-yari-css/css_properties_reference/index.json"

const str = data.doc.body[0].value.content
, parser = /<td>([^<]*)<\/td>/g
, parsed = [...new Set(
  [...str.matchAll(parser)]
  .map(([_, property]) => property.replace(/([A-Z])/g, "-$1").toLowerCase()))
]

console.log(JSON.stringify(parsed, null, 2))
