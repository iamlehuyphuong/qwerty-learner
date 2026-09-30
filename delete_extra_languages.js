const fs = require('fs')
const path = require('path')

let content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// URLs to delete
const jsonUrls = ['/dicts/kazakh_basic_3000_arabic_hapin.json', '/dicts/kazakh_basic_3000_cyrillic_hapin.json', '/dicts/Indonesian.json']

for (const url of jsonUrls) {
  const file = path.join('public', url)
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log('Deleted', file)
  }
}

// Remove blocks from code
content = content.replace(/\/\/ Tiếng KazakhstanHapintừ điển[\s\S]*?const kazakhHapinDicts: DictionaryResource\[\] = \[[\s\S]*?\]\n+/g, '')
content = content.replace(
  /\/\/Tiếng Indonesiatần suất caotừ vựng[\s\S]*?const indonesianDicts: DictionaryResource\[\] = \[[\s\S]*?\]\n+/g,
  '',
)

content = content.replace(/\s*\.\.\.kazakhHapinDicts,/g, '')
content = content.replace(/\s*\.\.\.indonesianDicts,/g, '')

fs.writeFileSync('src/resources/dictionary.ts', content)
console.log('dictionary.ts updated')
