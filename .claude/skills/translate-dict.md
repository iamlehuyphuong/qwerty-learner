---
name: translate-dict
description: Dịch nghĩa tiếng Trung sang tiếng Việt trong file từ điển JSON. Hỗ trợ dịch hàng loạt hoặc từng file.
---

# Skill: Dịch từ điển Trung → Việt

## Mục tiêu

Dịch các định nghĩa tiếng Trung (`"trans": ["唱歌"]`) sang tiếng Việt (`"trans": ["hát"]`) trong các file JSON từ điển tại `public/dicts/`.

Quy tắc:
- Giữ nguyên từ loại: `n.`, `vt.`, `vi.`, `adj.`, `adv.`, `prep.`, `vt.&vi.`, v.v.
- Giữ nguyên tiếng Anh trong dòng thì/chia động từ: `"时态:calendared, calendaring"` → `"thì:calendared, calendaring"`
- Dịch label tiếng Trung: `时态`→`thì`, `名词`→`danh từ`, `形容词`→`tính từ`, `动词`→`động từ`, `副词`→`phó từ`
- Nếu `"trans": []` (rỗng), bổ sung bản dịch tiếng Việt dựa trên từ vựng tiếng Anh (`"name"`)

## Cách sử dụng

Khi user gọi skill này, hỏi user muốn dịch file nào:
- Một file cụ thể: `EF_LEVEL_2.json`
- Một nhóm file: `EF_LEVEL_*.json`
- Tất cả file chưa dịch: `*.json`

## Quy trình thực thi

### Bước 1: Kiểm tra trước (dry-run)

Chạy dry-run trước để xem tổng quan:

```bash
cd /Users/macos/Work/WebApps/qwerty-learner/public/dicts
python3 ../../.claude/skills/translate_zh_vi.py "<pattern>" --dry-run
```

Báo cho user biết số lượng entries cần dịch.

### Bước 2: Dịch

Nếu user đồng ý, chạy dịch thực tế với backup:

```bash
cd /Users/macos/Work/WebApps/qwerty-learner/public/dicts
python3 ../../.claude/skills/translate_zh_vi.py "<pattern>" --backup
```

### Bước 3: Kiểm tra kết quả

Sau khi dịch xong, đọc file JSON để kiểm tra mẫu vài entries đầu, đảm bảo:
- Không còn ký tự Trung Quốc trong `trans`
- Bản dịch tiếng Việt có ý nghĩa
- Entries rỗng đã được bổ sung

## Script dịch

Script chính: `.claude/skills/translate_zh_vi.py`

Sử dụng thư viện `googletrans` để dịch batch. Cần cài đặt:
```bash
pip install googletrans==4.0.0-rc1
```

## Lưu ý quan trọng

- Luôn chạy `--dry-run` trước khi dịch thực tế
- Luôn dùng `--backup` để tạo file .bak phòng trường hợp cần rollback
- Google Translate API có rate limit, nên xử lý từng nhóm file nhỏ (5-10 file một lần)
- Sau khi dịch xong một nhóm, kiểm tra kết quả trước khi tiếp tục
- File đã có bản dịch tiếng Việt sẽ được bỏ qua tự động
- Nếu googletrans bị rate limit, đợi vài phút rồi thử lại

## Ví dụ output

Trước:
```json
{
    "name": "sing",
    "trans": ["唱歌"]
}
```

Sau:
```json
{
    "name": "sing",
    "trans": ["hát"]
}
```

Trước (rỗng):
```json
{
    "name": "hello",
    "trans": []
}
```

Sau:
```json
{
    "name": "hello",
    "trans": ["xin chào"]
}
```
