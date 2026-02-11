"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDiagnosis } from "@/context/DiagnosisContext";
import { Locale } from "@/i18n.config";
import { RESULT_COUNT, Group } from "@/lib/types";
import ResultMemberCard from "./ResultMemberCard";
import ShareButtons from "./ShareButtons";
import { getLocalizedName } from "@/lib/utils";

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
    finalCandidates: string;
  };
}

export default function ResultClient({ locale, groups, dict }: ResultClientProps) {
  const router = useRouter();
  const { state, reset, isBattleComplete } = useDiagnosis();
  const [showResults, setShowResults] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  const compatibilityByMemberId = useMemo(() => {
    const ranked = state.finalRanking;
    if (ranked.length === 0) return {};

    // 見た目を安定させるため、Match%は「順位」から割り当てる。
    // - 下位が極端に低くならない（レンジを70〜99%に制限）
    // - 丸めによる同率が出にくい（出た場合も必ず順位ごとにユニークになるよう補正）
    const n = ranked.length;
    const lower = 60;
    const upper = 99;
    // 0<gamma<1 で下位が落ちすぎないカーブになる（小さいほど下位が高くなる）
    const gamma = 0.65;

    const map: Record<string, number> = {};
    let prev = Infinity;

    for (let idx = 0; idx < n; idx++) {
      const t = n === 1 ? 1 : 1 - idx / (n - 1); // 1位=1 → 最下位=0
      const pctFloat = lower + (upper - lower) * Math.pow(t, gamma);
      let pct = Math.round(pctFloat);

      // 同率が出たら必ず順位が高い方が大きくなるように補正（ユニーク保証）
      if (idx > 0 && pct >= prev) {
        pct = prev - 1;
      }

      // 下限を割らないように（レンジ内に収める）
      pct = Math.min(upper, Math.max(lower, pct));

      map[ranked[idx].member.id] = pct;
      prev = pct;
    }

    return map;
  }, [state.finalRanking]);

  const watermarkText =
    locale === "ko"
      ? "📸 결과를 캡처해서 X에 공유하세요!"
      : locale === "en"
      ? "📸 Screenshot your results and share on X!"
      : "📸 結果をスクショしてXでシェアしよう！";

  const getGroupName = (groupId: string): string => {
    const group = groups.find((g) => g.id === groupId);
    return group ? getLocalizedName(group, locale) : "";
  };

  const getGroupBlogUrl = (groupId: string): string => {
    const group = groups.find((g) => g.id === groupId);
    return group?.blogUrl || "";
  };

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
  const remainingCandidates = state.finalRanking.slice(RESULT_COUNT);

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
                groupName={getGroupName(first.member.groupId)}
                groupBlogUrl={getGroupBlogUrl(first.member.groupId)}
                compatibilityPercent={compatibilityByMemberId[first.member.id]}
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
                groupName={getGroupName(second.member.groupId)}
                groupBlogUrl={getGroupBlogUrl(second.member.groupId)}
                  compatibilityPercent={compatibilityByMemberId[second.member.id]}
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
                groupName={getGroupName(third.member.groupId)}
                groupBlogUrl={getGroupBlogUrl(third.member.groupId)}
                  compatibilityPercent={compatibilityByMemberId[third.member.id]}
                  size="small"
                />
              </div>
            )}
          </div>
        </div>

        {/* ウォーターマーク（画像保存時に表示） */}
        <div
          className={`
            mt-3 text-center text-xs text-gray-400
            transition-all duration-500
            ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {watermarkText}
        </div>
      </div>

      {/* シェア・アクションボタン */}
      <div
        className={`
          mt-4 w-full max-w-sm space-y-1
          transition-all duration-500 delay-500
          ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
      >
        {/* シェアボタン */}
        <ShareButtons
          topMembers={topMembers}
          groups={groups}
          locale={locale}
          dict={{
            shareX: dict.shareX,
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

      {/* 4位以降の最終候補（TOP3除外） */}
      {remainingCandidates.length > 0 && (
        <div
          className={`
            mt-4 w-full max-w-sm space-y-2
            transition-all duration-500 delay-500
            ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          <p className="text-sm font-semibold text-gray-700 text-center">
            {dict.finalCandidates}
          </p>
          <div className="flex flex-col gap-2">
            {remainingCandidates.map((candidate, idx) => (
              <ResultMemberCard
                key={candidate.member.id}
                candidate={candidate}
                rank={idx + 4}
                locale={locale}
                groupName={getGroupName(candidate.member.groupId)}
                groupBlogUrl={getGroupBlogUrl(candidate.member.groupId)}
                compatibilityPercent={compatibilityByMemberId[candidate.member.id]}
                hideOverlayName
                size="mini"
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
