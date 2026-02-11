import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Poppins } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// サイトURL（本番環境では環境変数から取得）
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oshichecker.example.com";

export const metadata: Metadata = {
  title: "推しチェッカー | 韓国地下アイドル診断",
  description: "あなたにぴったりの韓国地下アイドルメンバーを診断します。アンケートと二択バトルで、運命の推しを見つけよう！",
  keywords: ["韓国アイドル", "地下アイドル", "推し診断", "K-POP", "推しチェッカー"],
  
  // その他のメタ情報
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdf2f8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${poppins.variable}`}>
      <body className="font-sans min-h-screen">
        {/* 背景デコレーション */}
        <div 
          className="decoration-blob"
          style={{
            width: "300px",
            height: "300px",
            background: "linear-gradient(135deg, #fecaca 0%, #fde68a 100%)",
            top: "-100px",
            right: "-100px",
          }}
        />
        <div 
          className="decoration-blob"
          style={{
            width: "400px",
            height: "400px",
            background: "linear-gradient(135deg, #c4b5fd 0%, #fbcfe8 100%)",
            bottom: "-150px",
            left: "-150px",
          }}
        />
        {children}
      </body>
    </html>
  );
}
