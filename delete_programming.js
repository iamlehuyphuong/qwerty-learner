const fs = require('fs')
const path = require('path')

let content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// Find the programming block
const startIdx = content.indexOf('const programming: DictionaryResource[] = [')
let endIdx = -1
if (startIdx !== -1) {
  // Find the closing bracket of the array
  // Since there might be nested objects, we just look for `\n]\n` after the startIdx
  endIdx = content.indexOf('\n]\n', startIdx) + 3
}

if (startIdx !== -1 && endIdx !== -1) {
  const block = content.substring(startIdx, endIdx)

  // Extract URLs
  const urlRegex = /url:\s*'([^']+)'/g
  let match
  let deletedCount = 0
  while ((match = urlRegex.exec(block)) !== null) {
    const file = path.join('public', match[1])
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
      deletedCount++
    }
  }
  console.log(`Deleted ${deletedCount} programming JSON files.`)

  // Remove block
  content = content.replace(block, '')
}

// Remove the ...programming, reference
content = content.replace(/\s*\.\.\.programming,/g, '')

fs.writeFileSync('src/resources/dictionary.ts', content)
console.log('Removed programming from dictionary.ts')
