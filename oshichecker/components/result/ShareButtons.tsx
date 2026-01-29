"use client";

import { useState } from "react";
import { CandidateMember, Group } from "@/lib/types";
import { Locale } from "@/i18n.config";
import { getLocalizedName } from "@/lib/utils";

interface ShareButtonsProps {
  topMembers: CandidateMember[];
  groups: Group[];
  locale: Locale;
  dict: {
    shareX: string;
  };
}

// サイトURL（本番環境では環境変数から取得）
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oshichecker.example.com";

export default function ShareButtons({
  topMembers,
  groups,
  locale,
  dict,
}: ShareButtonsProps) {
  // 共有ボタン押下の連打防止（誤爆でintent画面が複数開くのを防ぐ）
  const [isSharing, setIsSharing] = useState(false);

  // グループ名を取得するヘルパー
  const getGroupName = (groupId: string): string => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return "";
    return getLocalizedName(group, locale);
  };

  // シェアテキストを生成
  const generateShareText = (): string => {
    const rankEmojis = ["👑", "🥈", "🥉"];

    const rankLabels =
      locale === "ko"
        ? ["1위", "2위", "3위"]
        : locale === "en"
          ? ["1st", "2nd", "3rd"]
          : ["1位", "2位", "3位"];

    const buildResultLines = (withRankLabel: boolean): string[] => {
      return topMembers.slice(0, 3).map((candidate, index) => {
        const memberName = getLocalizedName(candidate.member, locale);
        const groupName = getGroupName(candidate.member.groupId);
        const suffix = groupName ? `（${groupName}）` : "";
        if (withRankLabel) {
          // ko/en の既存フォーマット維持（rank label を含む）
          return `${rankEmojis[index]} ${rankLabels[index]}: ${memberName}${suffix}`;
        }
        // ja の新フォーマット（rank label なし）
        return `${rankEmojis[index]} ${memberName}${suffix}`;
      });
    };

    // 日本語（ja）のみ、指定の完成形に変更する（ko/enは絶対に変更しない）
    if (locale === "ja") {
      const fixedJaUrl = "https://oshichecker2.vercel.app/ja";
      const resultLines = buildResultLines(false);
      return [
        "【韓国地下アイドル推し診断】",
        "",
        "私の結果はこれ👇",
        ...resultLines,
        "",
        "あなたの1位は誰だった？",
        "結果リプで教えてほしい👀",
        "#推しチェッカー #韓国地下アイドル",
        fixedJaUrl,
      ].join("\n");
    }

    // ここから先は ko/en のみ（ja は絶対に変更しない）
    const buildRankedLinesNoRankLabel = (): string[] => {
      return topMembers.slice(0, 3).map((candidate, index) => {
        const memberName = getLocalizedName(candidate.member, locale);
        const groupName = getGroupName(candidate.member.groupId);
        const suffix = groupName ? `（${groupName}）` : "";
        // 指定テンプレに合わせ、rank label（1위/1st/1位 等）は付けない
        return `${rankEmojis[index]} ${memberName}${suffix}`;
      });
    };

    if (locale === "ko") {
      const fixedKoUrl = "https://oshichecker2.vercel.app/ko";
      const rankedLines = buildRankedLinesNoRankLabel();
      return [
        "【지하아이돌 오시 진단】",
        "",
        "제 결과는 이거예요👇",
        ...rankedLines,
        "",
        "여러분의 1위는 누구였어요?",
        "댓글로 알려주세요👀",
        "#오시체커 #지하아이돌",
        fixedKoUrl,
      ].join("\n");
    }

    // locale === "en"
    const fixedEnUrl = "https://oshichecker2.vercel.app/en";
    const rankedLines = buildRankedLinesNoRankLabel();
    return [
      "【Korean Underground Idol Bias Test】",
      "",
      "Here is my result👇",
      ...rankedLines,
      "",
      "Who was your #1?",
      "Let me know your result in the replies 👀",
      fixedEnUrl,
    ].join("\n");
  };

  // Xでシェア
  const handleShareX = () => {
    if (isSharing) return;
    setIsSharing(true);
    const text = generateShareText();
    const encodedText = encodeURIComponent(text);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer,width=550,height=420");
    // すぐ戻す（intentウィンドウがブロックされても再試行できるように）
    setTimeout(() => setIsSharing(false), 800);
  };

  return (
    <div className="w-full">
      {/* Xでシェアボタン */}
      <button
        onClick={handleShareX}
        className="w-full py-3 px-4 rounded-xl font-medium text-white
          bg-black hover:bg-gray-800 active:bg-gray-900
          transition-colors duration-200
          flex items-center justify-center gap-2 shadow-md"
      >
        {/* X (Twitter) アイコン */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>{dict.shareX}</span>
      </button>
    </div>
  );
}
