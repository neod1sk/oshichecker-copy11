import { Locale, locales } from "@/i18n.config";
import { getDictionary } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Providers from "@/components/Providers";
import Link from "next/link";
import { GlobalBlogBanner } from "@/components/GlobalBlogBanner";
import type { Metadata } from "next";

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

// 静的パラメータ生成
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

// OGP / Twitter Card（SSR）
export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = params;

  const titles: Record<Locale, string> = {
    ja: "推しチェッカー | 韓国地下アイドル診断",
    ko: "오시체커 | 한국 지하 아이돌 진단",
    en: "Oshi Checker | Korean Underground Idol Test",
  };

  const descriptions: Record<Locale, string> = {
    ja: "あなたにぴったりの韓国地下アイドルメンバーを診断します。アンケートと二択バトルで、運命の推しを見つけよう！",
    ko: "당신에게 딱 맞는 한국 지하 아이돌 멤버를 진단합니다. 설문과 밸런스 게임으로 운명의 최애를 찾아보세요!",
    en: "Find your perfect Korean underground idol member. Take the survey and battles to discover your fate bias!",
  };

  const siteNames: Record<Locale, string> = {
    ja: "推しチェッカー",
    ko: "오시체커",
    en: "Oshi Checker",
  };

  const title = titles[locale] ?? titles.ja;
  const description = descriptions[locale] ?? descriptions.ja;
  const imageUrl = OGP_IMAGE_BY_LOCALE[locale] ?? OGP_IMAGE_BY_LOCALE.ja;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "en" ? "en_US" : "ja_JP",
      url: `${SITE_URL}/${locale}`,
      siteName: siteNames[locale] ?? siteNames.ja,
      title,
      description,
      images: [
        {
          url: imageUrl,
          type: "image/png",
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

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const footerText = dict.home?.footer || "© 2026 推しチェッカー";

  return (
    <Providers>
      <main className="max-w-md mx-auto px-4 py-4 safe-top safe-bottom min-h-screen flex flex-col">
        {/* ヘッダー */}
        <header className="header">
          <Link 
            href={`/${locale}`}
            className="text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
          >
            {dict.common.appName}
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </header>
        
        {/* コンテンツ */}
        <div className="flex-1 w-full">
          {children}
        </div>

        {/* ブログバナー（全ページ下部、バトル中は非表示） */}
        <GlobalBlogBanner />

        {/* フッター */}
        <p className="mt-3 text-gray-400 text-xs text-center">{footerText}</p>
      </main>
    </Providers>
  );
}
