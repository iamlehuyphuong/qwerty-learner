const fs = require('fs')
const path = require('path')

let content = fs.readFileSync('src/resources/dictionary.ts', 'utf8')

// 1. Delete Chinese domestic school dictionaries
const idsToDelete = [
  'gaokao3500',
  'gaokaozhentihexin',
  'gaokao-yuedu-gaopin',
  'zhongkaohexin',
  'SHjuniormiddleOxford',
  'BJJuniorHigh',
  'Cambridge_JOIN_IN',
]

const blockRegex = /\{\s*id:\s*'([^']+)',[\s\S]*?url:\s*'([^']+)',[\s\S]*?\},?\s*/g
let match
const urlsToDelete = []

while ((match = blockRegex.exec(content)) !== null) {
  if (idsToDelete.includes(match[1])) {
    urlsToDelete.push(match[2])
  }
}

for (const url of urlsToDelete) {
  const file = path.join('public', url)
  if (fs.existsSync(file)) fs.unlinkSync(file)
}

for (const id of idsToDelete) {
  const regex = new RegExp(`\\{\\s*id:\\s*'${id}',[\\s\\S]*?\\},?\\s*`, 'g')
  content = content.replace(regex, '')
}

// 2. Translate remaining dictionary names & descriptions
const translations = {
  // NCE
  'khái niệm mớiTiếng Anh-1': 'New Concept English 1',
  'khái niệm mớiTiếng AnhKHÔNG.mộtsách': 'New Concept English Quyển 1',
  'khái niệm mớiTiếng Anh-2': 'New Concept English 2',
  'khái niệm mớiTiếng AnhKHÔNG.haisách': 'New Concept English Quyển 2',
  'khái niệm mớiTiếng Anh-3': 'New Concept English 3',
  'khái niệm mớiTiếng AnhKHÔNG.basách': 'New Concept English Quyển 3',
  'khái niệm mớiTiếng Anh-4': 'New Concept English 4',
  'khái niệm mớiTiếng AnhKHÔNG.bốnsách': 'New Concept English Quyển 4',

  'khái niệm mớiTiếng Anh(phiên bản mới)-1': 'New Concept English 1 (Mới)',
  'khái niệm mớiTiếng Anhphiên bản mớiKHÔNG.mộtsách': 'New Concept English Quyển 1 (Bản mới)',
  'khái niệm mớiTiếng Anh(phiên bản mới)-2': 'New Concept English 2 (Mới)',
  'khái niệm mớiTiếng Anhphiên bản mớiKHÔNG.haisách': 'New Concept English Quyển 2 (Bản mới)',
  'khái niệm mớiTiếng Anh(phiên bản mới)-3': 'New Concept English 3 (Mới)',
  'khái niệm mớiTiếng Anhphiên bản mớiKHÔNG.basách': 'New Concept English Quyển 3 (Bản mới)',
  'khái niệm mớiTiếng Anh(phiên bản mới)-4': 'New Concept English 4 (Mới)',
  'khái niệm mớiTiếng Anhphiên bản mớiKHÔNG.bốnsách': 'New Concept English Quyển 4 (Bản mới)',

  // RAZ
  'RAZ Đọc được xếp loại ': 'Reading A-Z (RAZ) Cấp độ ',
  'RAZ Đọc được xếp loại tất cảtừ vựng': 'Reading A-Z (RAZ) Trọn bộ',
  'tất cảtừ vựng': 'Trọn bộ',

  // EF
  EFcấp: 'EF Cấp độ ',

  // Other English
  'từBảng trao đổi xuất phát từReading Explorer 3, Third Edition': 'Từ vựng từ Reading Explorer 3 (Third Edition)',
  macmillan7000: 'Macmillan 7000',
  'VOA Căn cứtừ vựng': 'Từ vựng VOA Cơ bản',

  // Japanese
  'những từ thông dụng của người Nhật': 'Tiếng Nhật thông dụng',
  'Tiếng Anhdịch': 'Dịch Nhật - Anh',
  'dịch thuật tiếng trung': 'Dịch Nhật - Trung',
  'tần suất caotừ_': 'Từ vựng Tần suất cao ',
  'tần suất caotừ_Tiếng Nhật': 'Từ vựng Tần suất cao Tiếng Nhật ',
  'chữ hiraganaluyện tập': 'Luyện tập chữ Hiragana',
  'Katakanaluyện tập': 'Luyện tập chữ Katakana',

  // German
  'Tiếng Đức Bản dịch Tiếng Anh': 'Đức - Anh',
  'Tiếng Đứctừ vựng, Tiếng Anhdịch': 'Từ vựng Tiếng Đức, Dịch Tiếng Anh',
  'Tiếng Anh Bản dịch Tiếng Đức': 'Anh - Đức',
  'Tiếng Anhtừ vựng，Tiếng Đứcdịch': 'Từ vựng Tiếng Anh, Dịch Tiếng Đức',

  // TOEFL/IELTS/PTE
  'PTE Cụm từ thông dụng (không chính thức)': 'Cụm từ thông dụng PTE',
  'FCE Cụm từ thông dụng (không chính thức)': 'Cụm từ thông dụng FCE',
  'Categorized Vocab.': 'Từ vựng phân loại',
  'từTheo chủ đề TOEFL 2021 by ZhangHongYan (sách gốc Nghĩa và ghi nhớ; từsự liên tiếpCon số)':
    'Từ vựng TOEFL Theo chủ đề (ZhangHongYan 2021)',
}

for (const [key, value] of Object.entries(translations)) {
  content = content.split(key).join(value)
}

fs.writeFileSync('src/resources/dictionary.ts', content)
console.log('Finished updating final dictionaries!')
