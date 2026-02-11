import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/i18n";
import { Group } from "@/lib/types";
import ResultClient from "@/components/result/ResultClient";

// グループデータをインポート
import groupsData from "@/data/groups.json";

// サイトURL（本番環境では環境変数から取得。なければVercelのURLを採用）
const SITE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL; // e.g. "oshichecker2.vercel.app"
  if (vercel) return `https://${vercel}`;
  return "https://oshichecker.example.com";
})();

const OGP_IMAGE_BY_LOCALE: Record<Locale, string> = {
  ja: "https://assets.st-note.com/img/1770787818-nq9wT6rolLp0CkSmhIFZzi58.png",
  ko: "https://assets.st-note.com/img/1770787818-BHEhOT3azXFtRyP8JAbjMovC.png",
  en: "https://assets.st-note.com/img/1770787818-WnJw2KTdijZ9erc1sYtkbGEL.png",
};

interface ResultPageProps {
  params: { locale: Locale };
}

// OGPメタデータを生成
export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { locale } = params;
  
  const titles = {
    ja: "診断結果 | 推しチェッカー",
    ko: "진단 결과 | 오시체커",
    en: "Results | Oshi Checker",
  };
  
  const descriptions = {
    ja: "あなたの推しメンバー TOP3 が決定しました！結果をシェアしよう！",
    ko: "당신의 최애 멤버 TOP3가 결정되었습니다! 결과를 공유해보세요!",
    en: "Your Top 3 bias members have been determined! Share your results!",
  };
  
  const title = titles[locale] || titles.ja;
  const description = descriptions[locale] || descriptions.ja;
  const imageUrl = OGP_IMAGE_BY_LOCALE[locale] || OGP_IMAGE_BY_LOCALE.ja;
  
  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "en" ? "en_US" : "ja_JP",
      url: `${SITE_URL}/${locale}/result`,
      siteName: locale === "ko" ? "오시체커" : locale === "en" ? "Oshi Checker" : "推しチェッカー",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const groups = groupsData as Group[];

  return (
    <ResultClient
      locale={locale}
      groups={groups}
      dict={{
        title: dict.result.title,
        subtitle: dict.result.subtitle,
        yourOshi: dict.result.yourOshi,
        restart: dict.result.restart,
        noResult: locale === "ko"
          ? "결과가 없습니다. 진단을 먼저 완료해주세요."
          : locale === "en"
          ? "No results found. Please complete the diagnosis first."
          : "結果がありません。診断を完了してください。",
        share: dict.result.share,
        shareX: locale === "ko"
          ? "X에서 결과 공유"
          : locale === "en"
          ? "Share on X"
          : "Xで結果をシェア",
        finalCandidates: dict.result.finalCandidates,
      }}
    />
  );
}
