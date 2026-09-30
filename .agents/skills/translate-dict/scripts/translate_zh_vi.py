#!/usr/bin/env python3
"""Translate dictionary JSON files from Chinese to Vietnamese.

Preserves:
  - Part-of-speech markers: n., vt., vi., adj., adv., prep., etc.
  - Tense/conjugation entries: "时态:calendared, calendaring, calendars"
  - Chinese grammar labels are translated, English content kept as-is.

Usage:
    python3 translate_zh_vi.py <file_or_glob> [--dry-run] [--backup]

Examples:
    python3 translate_zh_vi.py EF_LEVEL_2.json
    python3 translate_zh_vi.py "EF_LEVEL_*.json"
    python3 translate_zh_vi.py "*.json" --dry-run
    python3 translate_zh_vi.py BEC_3_T.json --backup
"""

import json
import sys
import re
import time
import glob
import shutil
import argparse
from googletrans import Translator

POS_PATTERN = re.compile(r'^([a-z]+\.(?:&[a-z]+\.)*\s+)')

LABEL_MAP = {
    '时态': 'thì',
    '名 词': 'danh từ',
    '名词': 'danh từ',
    '形容词': 'tính từ',
    '形 容 词': 'tính từ',
    '动词': 'động từ',
    '动 词': 'động từ',
    '副词': 'phó từ',
    '副 词': 'phó từ',
}


def has_chinese(text):
    return bool(re.search(r'[一-鿿]', text))


def has_vietnamese(text):
    return bool(re.search(
        r'[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]',
        text.lower()
    ))


def clean_translation(text):
    parts = re.split(r',|;', text)
    parts = [p.strip() for p in parts if p.strip()]
    seen = set()
    cleaned = []
    for p in parts:
        lower_p = p.lower()
        if lower_p not in seen:
            seen.add(lower_p)
            cleaned.append(p)
    return ', '.join(cleaned)


def is_metadata_entry(text):
    """Check if this trans entry is a tense/grammar metadata line."""
    if text.startswith('时态') or text.startswith('thì'):
        return True
    for label in LABEL_MAP:
        if re.match(rf'^{re.escape(label)}[:：]', text):
            return True
    return False


def replace_chinese_labels(text):
    """Replace Chinese grammar labels with Vietnamese, keep English content."""
    result = text
    for zh, vi in sorted(LABEL_MAP.items(), key=lambda x: -len(x[0])):
        result = result.replace(zh, vi)
    return result


def extract_pos_and_chinese(text):
    """Split a trans entry into (pos_prefix, chinese_part).

    Returns:
        (pos_prefix, chinese_part) where pos_prefix may be '' if none found.
    """
    m = POS_PATTERN.match(text)
    if m:
        return m.group(1), text[m.end():]
    return '', text


def translate_batch(translator, texts, src, batch_size=30):
    """Translate a list of (key, text) pairs. Returns {key: translated}."""
    results = {}
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        keys = [b[0] for b in batch]
        values = [b[1] for b in batch]

        combined = "\n\n".join(values)
        success = False
        retries = 3

        while not success and retries > 0:
            try:
                res = translator.translate(combined, src=src, dest='vi')
                parts = [p.strip() for p in res.text.split("\n\n") if p.strip()]

                if len(parts) == len(batch):
                    for k, part in enumerate(parts):
                        results[keys[k]] = clean_translation(part)
                    success = True
                else:
                    raise Exception(f"Length mismatch: {len(parts)} vs {len(batch)}")
                time.sleep(1)
            except Exception as e:
                print(f"  Batch failed ({e}), falling back to one-by-one...")
                for key, text in batch:
                    if key in results:
                        continue
                    try:
                        r = translator.translate(text, src=src, dest='vi')
                        results[key] = clean_translation(r.text)
                        time.sleep(0.3)
                    except Exception as e2:
                        print(f"  Failed '{text[:30]}...': {e2}")
                        results[key] = text
                success = True

                if not success:
                    retries -= 1
                    time.sleep(2)
                    translator = Translator()

        progress = min(i + batch_size, len(texts))
        print(f"  Progress: {progress}/{len(texts)}")

    return results


def process_file(file_path, dry_run=False, backup=False):
    print(f"\n{'='*60}")
    print(f"Processing: {file_path}")
    print(f"{'='*60}")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, list):
        print("  Skipping: not a list format")
        return

    # Phase 1: classify each trans entry
    to_translate_zh = []  # [(key=(i,j), chinese_text)] — will be sent to translator
    pos_prefixes = {}     # {(i,j): "n. "} — reattach after translation
    metadata_fixes = []   # [(i, j, fixed_text)] — label replacement only, no API call
    to_translate_en = []  # [(i, name)] — empty trans, translate English word
    already_vi = 0
    skipped = 0

    for i, item in enumerate(data):
        trans = item.get('trans', [])
        if not trans:
            to_translate_en.append((i, item.get('name', '')))
            continue

        for j, t in enumerate(trans):
            if not has_chinese(t):
                if has_vietnamese(t):
                    already_vi += 1
                else:
                    skipped += 1
                continue

            # Has Chinese — classify further
            if is_metadata_entry(t):
                fixed = replace_chinese_labels(t)
                if fixed != t:
                    metadata_fixes.append((i, j, fixed))
                else:
                    skipped += 1
                continue

            pos, chinese_part = extract_pos_and_chinese(t)
            key = (i, j)
            if pos:
                pos_prefixes[key] = pos
            to_translate_zh.append((key, chinese_part))

    print(f"  Chinese entries to translate: {len(to_translate_zh)}")
    print(f"  Metadata label fixes: {len(metadata_fixes)}")
    print(f"  Empty entries (EN->VI): {len(to_translate_en)}")
    print(f"  Already Vietnamese: {already_vi}")
    print(f"  Other (English defs): {skipped}")

    total_changes = len(to_translate_zh) + len(metadata_fixes) + len(to_translate_en)
    if total_changes == 0:
        print("  Nothing to translate!")
        return

    if dry_run:
        print(f"  [DRY RUN] Would process {total_changes} entries")
        return

    if backup:
        backup_path = file_path + '.bak'
        shutil.copy2(file_path, backup_path)
        print(f"  Backup saved: {backup_path}")

    # Phase 2: apply metadata label fixes (no API call needed)
    for i, j, fixed in metadata_fixes:
        data[i]['trans'][j] = fixed

    translator = Translator()

    # Phase 3: translate Chinese definitions
    if to_translate_zh:
        print(f"\n  Translating {len(to_translate_zh)} Chinese -> Vietnamese...")
        zh_results = translate_batch(translator, to_translate_zh, src='zh-cn')

        for (i, j), translated in zh_results.items():
            pos = pos_prefixes.get((i, j), '')
            data[i]['trans'][j] = pos + translated

    # Phase 4: translate empty trans from English
    if to_translate_en:
        print(f"\n  Translating {len(to_translate_en)} English -> Vietnamese...")
        en_results = translate_batch(translator, to_translate_en, src='en')

        for i, translated in en_results.items():
            if 'trans' not in data[i] or not isinstance(data[i]['trans'], list):
                data[i]['trans'] = []
            data[i]['trans'].append(translated)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"\n  Saved: {file_path}")


def main():
    parser = argparse.ArgumentParser(description='Translate dictionary files from Chinese to Vietnamese')
    parser.add_argument('pattern', help='File path or glob pattern (e.g. "EF_LEVEL_*.json")')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be translated without making changes')
    parser.add_argument('--backup', action='store_true', help='Create .bak backup before modifying')
    args = parser.parse_args()

    files = sorted(glob.glob(args.pattern))
    if not files:
        print(f"No files matching: {args.pattern}")
        sys.exit(1)

    json_files = [f for f in files if f.endswith('.json')]
    if not json_files:
        print(f"No JSON files found matching: {args.pattern}")
        sys.exit(1)

    print(f"Found {len(json_files)} file(s) to process")
    if args.dry_run:
        print("[DRY RUN MODE]")

    for file_path in json_files:
        try:
            process_file(file_path, dry_run=args.dry_run, backup=args.backup)
        except Exception as e:
            print(f"  ERROR processing {file_path}: {e}")
            continue

    print(f"\n{'='*60}")
    print("All done!")


if __name__ == '__main__':
    main()
