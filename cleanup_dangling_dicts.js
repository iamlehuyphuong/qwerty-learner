const fs = require('fs')
const path = require('path')

const dictDir = 'public/dicts'
const tsContent = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// Find all .json files in public/dicts
const files = fs.readdirSync(dictDir).filter((f) => f.endsWith('.json'))

let deletedCount = 0
for (const file of files) {
  // If the filename is NOT anywhere in the TS file, it means it's an orphaned dictionary.
  if (!tsContent.includes(file)) {
    fs.unlinkSync(path.join(dictDir, file))
    deletedCount++
  }
}

console.log(`Deleted ${deletedCount} orphaned JSON files.`)
