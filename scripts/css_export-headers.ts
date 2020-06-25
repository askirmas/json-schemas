import {sync} from "globby"
import {readFileSync} from "fs"

type Description = Record<"title"|"summary"|"mdn_url", string>
type DocIndex = {doc: Description}

const {parse: $parse, stringify: $stringify} = JSON
, docsFolder = "docs/mdn-yari-css"
, file2search = "/index.json"
, files = sync(`**${file2search}`, {cwd: docsFolder, fullPath: true})
, {length} = files
, replaces = Object.entries({
  "_star_": "*",
  "_colon_": ":",
  "_doublecolon": "::"
})
, $return: Record<string, Description> = {}

for (let i = 0; i < length; i++) {
  const fileName = files[i]
  , name = replaces.reduce(
    (acc, [from, to]) => acc.replace(from, to),
    fileName.replace(file2search, '')
  )
  , {doc: {
    title, summary, mdn_url
  }} = readJson(`${docsFolder}/${fileName}`) as DocIndex

  $return[name] = {title, summary, mdn_url}
}

console.log($stringify($return, null, 2))

function readJson(path: string) {
  return $parse(readFileSync(path).toString())
}
