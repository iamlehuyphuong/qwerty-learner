const fs = require('fs')

let content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// Remove any lingering comments above where the block was
content = content.replace(/\/\/ Lập trình\n\n/g, '')
content = content.replace(/\/\/ Lập trình\n/g, '')
content = content.replace(/\/\/ Thực hành mã\n/g, '')
content = content.replace(/\/\/ Thực hành mã\n\n/g, '')
content = content.replace(/\/\/ Thực hành mã/g, '')

fs.writeFileSync('src/resources/dictionary.ts', content)
