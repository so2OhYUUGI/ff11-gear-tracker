import json
import os

# パス設定
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ITEMS_FILE = os.path.join(BASE_DIR, 'items.lua')
DESCS_FILE = os.path.join(BASE_DIR, 'item_descriptions.lua')
OUTPUT_FILE = os.path.join(BASE_DIR, 'all_jobs_gear.json') # 1つに統合

# ジョブ定義（前回と同じ）
JOB_MASTER = {
    "WAR": {"flag": 2, "kw": ["ＷＲ", "ＡＧ", "ＰＭ", "ＢＩ", "ファイター", "ウォリア", "アゴージ", "パメー", "ボイイ"]},
    "MNK": {"flag": 4, "kw": ["ＴＭ", "ＡＨ", "ＨＥ", "ＢＫ", "テンプル", "メレー", "アンホイヤー", "ヘリオス", "ビキ"]},
    "WHM": {"flag": 8, "kw": ["ＣＲ", "ＴＥ", "ＰＩ", "ＥＢ", "クレリク", "ヒエラー", "テオドール", "ピエト", "エーベル"]},
    "BLM": {"flag": 16, "kw": ["ＷＺ", "ＳＰ", "ＡＲ", "ＷＩ", "ウィザード", "ソーサラー", "スパエ", "アーチ", "ウィッカイ"]},
    "RDM": {"flag": 32, "kw": ["ＷＬ", "ＡＴ", "ＶＩ", "ＬＴ", "ワーロック", "デュエル", "アトピ", "ヴィティ", "レサジー"]},
    "THF": {"flag": 64, "kw": ["ＲＧ", "ＳＫ", "ＰＬ", "ローグ", "アサシン", "スカルカ", "ピレト"]},
    "PLD": {"flag": 128, "kw": ["ＧＬ", "ＲＶ", "ＣＢ", "ＣＶ", "ガラント", "バロー", "レベラン", "キャバリエ", "シヴァルリー"]},
    "DRK": {"flag": 256, "kw": ["ＣＳ", "ＩＧ", "ＡＢ", "ＦＬ", "カオス", "アビス", "イグニド", "バイル", "フォールン"]},
    "BST": {"flag": 512, "kw": ["ＭＳ", "ＡＫ", "ＭＳ", "ＮＵ", "ビースト", "モンスター", "アンキレー", "ヌグーミ"]},
    "BRD": {"flag": 1024, "kw": ["ＣＲ", "ＢＩ", "ＢＤ", "ＦＩ", "コラル", "バード", "ビリオド", "ブリオソ", "フィリア"]},
    "RNG": {"flag": 2048, "kw": ["ＨＴ", "ＡＭ", "ＡＲ", "ＯＲ", "ハンター", "スカウト", "アムード", "アルケ", "オリオン"]},
    "SAM": {"flag": 4096, "kw": ["ＭＹ", "ＷＫ", "ＳＡ", "ＫＳ", "妙手", "早乙女", "脇指", "左近士"]},
    "NIN": {"flag": 8192, "kw": ["ＭＣ", "ＨＣ", "ＭＯ", "ＨＴ", "乱波", "甲賀", "蜂屋", "望月", "真甲賀"]},
    "DRG": {"flag": 16384, "kw": ["ＷＹ", "ＶＩ", "ＷＹ", "ＰＴ", "竜騎士", "ウィルム", "ビスチュアル", "ペルタスト"]},
    "SMN": {"flag": 32768, "kw": ["ＳＭ", "ＢＣ", "ＳＭ", "ＧＬ", "サマナー", "エボカー", "ベコナー", "グリダア"]},
    "BLU": {"flag": 65536, "kw": ["ＭＡ", "ＬＬ", "ＨＳ", "ＡＳ", "メガス", "ルラーザ", "ハシシン", "アシム"]},
    "COR": {"flag": 131072, "kw": ["ＣＯ", "ＬＡ", "ＣＳ", "ＣＨ", "コルセア", "コモドール", "ラクサバー", "カマイン"]},
    "PUP": {"flag": 262144, "kw": ["ＰＡ", "ＦＯ", "ＰＩ", "ＫＡ", "パペット", "パンティン", "フォアイエ", "ピトレ", "カラゴズ"]},
    "DNC": {"flag": 524288, "kw": ["ＥＴ", "ＭＵ", "ＨＯ", "ＨＯ", "エトワール", "カリス", "マクレレ", "ホロドロ"]},
    "SCH": {"flag": 1048576, "kw": ["ＡＢ", "ＰＤ", "ＡＣ", "ＡＲ", "アギュト", "サバント", "ペダゴギ", "アカデモス", "アルバテル"]},
    "GEO": {"flag": 2097152, "kw": ["ＧＯ", "ＡＺ", "ＢＡ", "ＧＥ", "ジオ", "アジマス", "バグア", "アザゼル"]},
    "RUN": {"flag": 4194304, "kw": ["ＲＮ", "ＦＵ", "ＥＲ", "ＲＵ", "ルーン", "フサルク", "エリラズ"]}
}

ARMOR_SLOTS = [16, 32, 64, 128, 256]

def load_descriptions():
    desc_map = {}
    if not os.path.exists(DESCS_FILE):
        return desc_map

    with open(DESCS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    blocks = content.split('[')
    for block in blocks:
        if ']' not in block: continue
        id_part = block.split(']')[0].strip()
        if not id_part.isdigit(): continue
        item_id = int(id_part)
        
        def get_val(key):
            target = f'{key}="'
            if target in block:
                start = block.find(target) + len(target)
                ptr = start
                while ptr < len(block):
                    end_idx = block.find('"', ptr)
                    if end_idx == -1: break
                    if block[end_idx - 1] == '\\':
                        ptr = end_idx + 1
                        continue
                    else:
                        val = block[start:end_idx]
                        val = val.replace('\\"', '"')
                        # \\n を 実際の改行文字 \n に置換する
                        val = val.replace('\\n', '\n')
                        return val.strip()
            return ""

        desc_map[item_id] = {"en": get_val("en"), "ja": get_val("ja")}
    return desc_map

def main():
    descriptions = load_descriptions()
    if not os.path.exists(ITEMS_FILE): return

    with open(ITEMS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    items_raw = content.split('[')
    # 最終的なリスト（ジョブをフラットに持つか、ジョブごとの辞書にするか選べますが、管理上辞書にしています）
    final_data = {job: [] for job in JOB_MASTER}

    for block in items_raw:
        if 'id=' not in block: continue
        
        def find_attr(key, is_str=False):
            if is_str:
                parts = block.split(f'{key}="')
                return parts[1].split('"')[0] if len(parts) > 1 else ""
            else:
                import re
                match = re.search(f'{key}=(\d+)', block)
                return int(match.group(1)) if match else 0

        item_id = find_attr("id")
        name_ja = find_attr("ja", True)
        name_en = find_attr("enl", True)
        job_bits = find_attr("jobs")
        slot = find_attr("slots")
        cat = find_attr("category", True)

        if cat == "Armor" and slot in ARMOR_SLOTS:
            for job_code, master in JOB_MASTER.items():
                if (job_bits & master["flag"]) and any(kw in name_ja for kw in master["kw"]):
                    d = descriptions.get(item_id, {"ja": "", "en": ""})
                    final_data[job_code].append({
                        "id": item_id,
                        "ja": name_ja,
                        "en": name_en,
                        "slot": slot,
                        "level": find_attr("level"),
                        "description_ja": d["ja"],
                        "description_en": d["en"]
                    })

    # すべての結果を1つのファイルに書き出す
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

    print(f"統合完了！ {OUTPUT_FILE} を作成しました。")

if __name__ == "__main__":
    main()