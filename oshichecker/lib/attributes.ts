import { Locale } from "@/i18n.config";

export type AttributeCategory = "genre" | "vibe" | "performance" | "meet";

type AttributeDefinition = {
  key: string;
  category: AttributeCategory;
  label: {
    ja: string;
    ko?: string;
    en?: string;
  };
};

// カテゴリ付きで固定キーを一元管理（jaのみ定義、後でko/enを追加予定）
export const ATTRIBUTE_DEFINITIONS = [
  // genre
  { key: "genre_orthodox", category: "genre", label: { ja: "王道", ko: "정통", en: "Orthodox" } },
  { key: "genre_denpa", category: "genre", label: { ja: "電波", ko: "뎀파", en: "Denpa" } },
  { key: "genre_loud", category: "genre", label: { ja: "ラウド", ko: "라우드", en: "Loud" } },
  { key: "genre_alt", category: "genre", label: { ja: "オルタナ", ko: "얼터너티브", en: "Alternative" } },
  { key: "genre_dark", category: "genre", label: { ja: "ダーク", ko: "다크", en: "Dark" } },
  { key: "genre_gothic", category: "genre", label: { ja: "ゴシック", ko: "고딕", en: "Gothic" } },
  { key: "genre_cyber", category: "genre", label: { ja: "サイバー", ko: "사이버", en: "Cyber" } },
  { key: "genre_magical", category: "genre", label: { ja: "マジカル", ko: "마법", en: "Magical" } },
  { key: "genre_yami", category: "genre", label: { ja: "病み", ko: "야미", en: "Yami" } },

  // vibe
  { key: "cute", category: "vibe", label: { ja: "キュート", ko: "큐트", en: "Cute" } },
  { key: "squirrel", category: "vibe", label: { ja: "リス系", ko: "다람쥐상", en: "Squirrel-like" } },
  { key: "cool", category: "vibe", label: { ja: "クール", ko: "쿨", en: "Cool" } },
  { key: "pure", category: "vibe", label: { ja: "ピュア", ko: "퓨어", en: "Pure" } },
  { key: "sexy", category: "vibe", label: { ja: "セクシー", ko: "섹시", en: "Sexy" } },
  { key: "elegant", category: "vibe", label: { ja: "エレガント", ko: "엘레강스", en: "Elegant" } },
  { key: "healing", category: "vibe", label: { ja: "癒し", ko: "치유", en: "Healing" } },
  { key: "youthful", category: "vibe", label: { ja: "フレッシュ", ko: "상큼", en: "Fresh" } },
  { key: "mysterious", category: "vibe", label: { ja: "ミステリアス", ko: "신비로운", en: "Mysterious" } },
  { key: "unique", category: "vibe", label: { ja: "個性派", ko: "개성파", en: "Unique" } },
  { key: "idol_kpop", category: "vibe", label: { ja: "K-POPアイドル型", ko: "K-POP 아이돌형", en: "K-POP Idol Type" } },
  { key: "idol_polished", category: "vibe", label: { ja: "アイドル感強め", ko: "아이돌미가 강하다", en: "Strong idol vibes" } },
  // face (vibe扱い)
  { key: "face_cat", category: "vibe", label: { ja: "猫顔", ko: "고양이상", en: "Cat face" } },
  { key: "face_dog", category: "vibe", label: { ja: "子犬顔", ko: "강아지상", en: "Puppy face" } },
  { key: "face_rabbit", category: "vibe", label: { ja: "ウサギ顔", ko: "토끼상", en: "Bunny face" } },
  { key: "face_raccoon_dog", category: "vibe", label: { ja: "タヌキ顔", ko: "너구리상", en: "Raccoon face" } },
  { key: "face_fox", category: "vibe", label: { ja: "キツネ顔", ko: "여우상", en: "Fox face" } },
  { key: "face_squirrel", category: "vibe", label: { ja: "リス顔", ko: "다람쥐상", en: "Squirrel face" } },
  { key: "face_chick", category: "vibe", label: { ja: "ひよこ顔", ko: "병아리상", en: "Chick face" } },
  { key: "face_bird", category: "vibe", label: { ja: "小鳥顔", ko: "작은 새상", en: "Birdlike face" } },

  // performance
  { key: "dance", category: "performance", label: { ja: "ダンス", ko: "댄스", en: "Dance" } },
  { key: "vocal", category: "performance", label: { ja: "ボーカル", ko: "보컬", en: "Vocal" } },
  { key: "expression", category: "performance", label: { ja: "表現力", ko: "표현력", en: "Expression" } },
  { key: "energy", category: "performance", label: { ja: "エナジー", ko: "에너지", en: "Energy" } },
  { key: "stability", category: "performance", label: { ja: "安定感", ko: "안정감", en: "Stability" } },
  { key: "growth", category: "performance", label: { ja: "成長性", ko: "성장성", en: "Growth" } },
  { key: "presence", category: "performance", label: { ja: "存在感", ko: "존재감", en: "Presence" } },
  { key: "facial", category: "performance", label: { ja: "表情管理", ko: "표정 관리", en: "Facial control" } },
  { key: "charisma", category: "performance", label: { ja: "カリスマ", ko: "카리스마", en: "Charisma" } },

  // meet
  { key: "comfort", category: "meet", label: { ja: "癒し系", ko: "힐링형", en: "Soothing Type" } },
  { key: "cheer", category: "meet", label: { ja: "わくわく", ko: "설렘", en: "Excitement" } },
  { key: "charming", category: "meet", label: { ja: "愛嬌", ko: "애교", en: "Charm" } },
  { key: "calm", category: "meet", label: { ja: "穏やか", ko: "온화함", en: "Calm" } },
  { key: "dry", category: "meet", label: { ja: "ドライ", ko: "쿨함", en: "Dry" } },
  { key: "kind", category: "meet", label: { ja: "優しさ", ko: "상냥함", en: "Kindness" } },
  { key: "talk", category: "meet", label: { ja: "トーク力", ko: "토크력", en: "Talk skill" } },
  { key: "recognition", category: "meet", label: { ja: "認知強め", ko: "팬 인지 강함", en: "Fan-Aware" } },
  { key: "closeness", category: "meet", label: { ja: "距離感", ko: "거리감", en: "Closeness" } },
  { key: "social", category: "meet", label: { ja: "社交性", ko: "사교성", en: "Sociability" } },
  { key: "gap", category: "meet", label: { ja: "ツンデレ", ko: "츤데레", en: "Tsundere" } },
] as const satisfies readonly AttributeDefinition[];

export type AttributeKey = (typeof ATTRIBUTE_DEFINITIONS)[number]["key"];

export const ATTRIBUTE_KEYS = ATTRIBUTE_DEFINITIONS.map(
  (attr) => attr.key
) as readonly AttributeKey[];

export const ATTRIBUTE_LABELS: Record<
  AttributeKey,
  { ja: string; ko?: string; en?: string }
> = ATTRIBUTE_DEFINITIONS.reduce((acc, attr) => {
  acc[attr.key as AttributeKey] = attr.label;
  return acc;
}, {} as Record<AttributeKey, { ja: string; ko?: string; en?: string }>);

export const ATTRIBUTE_CATEGORIES: Record<AttributeCategory, AttributeKey[]> =
  ATTRIBUTE_DEFINITIONS.reduce(
    (acc, attr) => {
      acc[attr.category].push(attr.key as AttributeKey);
      return acc;
    },
    {
      genre: [] as AttributeKey[],
      vibe: [] as AttributeKey[],
      performance: [] as AttributeKey[],
      meet: [] as AttributeKey[],
    }
  );

const CATEGORY_COLORS: Record<AttributeCategory, string> = {
  genre: "#8b5cf6",        // パープル
  vibe: "#ec4899",         // ピンク
  performance: "#22c55e",  // グリーン
  meet: "#f59e0b",         // オレンジ
};

export function getAttributeLabel(key: AttributeKey, locale: Locale): string {
  const labels = ATTRIBUTE_LABELS[key];
  if (!labels) return key;
  return (labels as Record<string, string>)[locale] || labels.ja;
}

export function isValidAttributeKey(key: string): key is AttributeKey {
  return ATTRIBUTE_KEYS.includes(key as AttributeKey);
}

export function getAttributeColor(key: AttributeKey): string {
  const category = ATTRIBUTE_DEFINITIONS.find((attr) => attr.key === key)?.category;
  return (category && CATEGORY_COLORS[category]) || "#9ca3af";
}
