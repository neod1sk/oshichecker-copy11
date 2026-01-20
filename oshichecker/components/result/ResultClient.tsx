"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDiagnosis } from "@/context/DiagnosisContext";
import { Locale } from "@/i18n.config";
import { RESULT_COUNT, Group } from "@/lib/types";
import ResultMemberCard from "./ResultMemberCard";
import ShareButtons from "./ShareButtons";

interface ResultClientProps {
  locale: Locale;
  groups: Group[];
  dict: {
    title: string;
    subtitle: string;
    yourOshi: string;
    restart: string;
    noResult: string;
    share: string;
    shareX: string;
    saveImage: string;
  };
}

export default function ResultClient({ locale, groups, dict }: ResultClientProps) {
  const router = useRouter();
  const { state, reset, isBattleComplete } = useDiagnosis();
  const [showResults, setShowResults] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  // 結果がない場合のリダイレクト
  useEffect(() => {
    if (state.finalRanking.length === 0 && !isBattleComplete) {
      router.push(`/${locale}`);
    }
  }, [state.finalRanking.length, isBattleComplete, router, locale]);

  // 結果表示のアニメーション
  useEffect(() => {
    if (state.finalRanking.length > 0) {
      const timer = setTimeout(() => setShowResults(true), 300);
      return () => clearTimeout(timer);
    }
  }, [state.finalRanking.length]);

  // もう一度診断する
  const handleRestart = () => {
    reset();
    router.push(`/${locale}`);
  };

  // 結果がない場合
  if (state.finalRanking.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="card p-8 w-full max-w-sm">
          <p className="text-gray-600 mb-4">{dict.noResult}</p>
          <button onClick={handleRestart} className="btn-primary">
            {dict.restart}
          </button>
        </div>
      </div>
    );
  }

  // 上位3名を取得
  const topMembers = state.finalRanking.slice(0, RESULT_COUNT);
  const first = topMembers[0];
  const second = topMembers[1];
  const third = topMembers[2];

  return (
    <div className="flex flex-col items-center py-2">
      {/* 結果カード全体（画像保存用） */}
      <div ref={resultCardRef} className="w-full max-w-sm p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50">
        {/* ヘッダー */}
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="text-xl font-bold mb-1">
            <span className="text-gradient">{dict.title}</span>
          </h1>
          <p className="text-gray-500 text-xs">{dict.subtitle}</p>
        </div>

        {/* 結果カード */}
        <div className="space-y-3">
          {/* 1位：大カード */}
          {first && (
            <div
              className={`
                transition-all duration-500
                ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
            >
              <ResultMemberCard
                candidate={first}
                rank={1}
                locale={locale}
                size="large"
              />
            </div>
          )}

          {/* 2位・3位：小カード横並び */}
          <div className="grid grid-cols-2 gap-3">
            {second && (
              <div
                className={`
                  transition-all duration-500
                  ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                style={{ transitionDelay: "150ms" }}
              >
                <ResultMemberCard
                  candidate={second}
                  rank={2}
                  locale={locale}
                  size="small"
                />
              </div>
            )}
            {third && (
              <div
                className={`
                  transition-all duration-500
                  ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                style={{ transitionDelay: "300ms" }}
              >
                <ResultMemberCard
                  candidate={third}
                  rank={3}
                  locale={locale}
                  size="small"
                />
              </div>
            )}
          </div>
        </div>

        {/* ウォーターマーク（画像保存時に表示） */}
        <div className="mt-3 text-center text-xs text-gray-400">
          画像はアイドルのツイートから引用しています
        </div>
      </div>

      {/* シェア・アクションボタン */}
      <div
        className={`
          mt-4 w-full max-w-sm space-y-2
          transition-all duration-500 delay-500
          ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {/* シェアボタン */}
        <ShareButtons
          topMembers={topMembers}
          groups={groups}
          locale={locale}
          resultCardRef={resultCardRef}
          dict={{
            shareX: dict.shareX,
            saveImage: dict.saveImage,
          }}
        />

        {/* もう一度診断 */}
        <button
          onClick={handleRestart}
          className="btn-secondary w-full py-2.5 text-sm"
        >
          {dict.restart}
        </button>
      </div>

      {/* フッター */}
      <p className="mt-4 text-gray-400 text-xs">
        © 2025 推しチェッカー
      </p>
    </div>
  );
}
