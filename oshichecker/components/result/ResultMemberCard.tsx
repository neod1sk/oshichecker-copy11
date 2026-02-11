"use client";

import type { KeyboardEventHandler } from "react";
import Image from "next/image";
import { CandidateMember } from "@/lib/types";
import { Locale } from "@/i18n.config";
import { getLocalizedName, isExternalUrl } from "@/lib/utils";
import { AttributeTagList } from "@/components/AttributeTag";

interface ResultMemberCardProps {
  candidate: CandidateMember;
  rank: number;
  locale: Locale;
  groupName?: string;
  groupBlogUrl?: string;
  compatibilityPercent?: number;
  hideOverlayName?: boolean;
  size?: "large" | "small" | "mini";
}

export default function ResultMemberCard({
  candidate,
  rank,
  locale,
  groupName,
  groupBlogUrl,
  compatibilityPercent,
  hideOverlayName = false,
  size = "large",
}: ResultMemberCardProps) {
  const { member } = candidate;
  const name = getLocalizedName(member, locale);
  const displayName = groupName ? `${name}（${groupName}）` : name;
  const isExternal = isExternalUrl(member.photoUrl);
  const xUrl = member.xUrl;
  const isClickable = Boolean(groupBlogUrl);

  const compatibilityLabel = "Match";
  const compatibilityText =
    typeof compatibilityPercent === "number"
      ? `${compatibilityLabel} ${Math.round(compatibilityPercent)}%`
      : "";

  const handleCardClick = () => {
    if (!groupBlogUrl) return;
    window.open(groupBlogUrl, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!isClickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  // ランクに応じたスタイル
  const rankStyles = {
    1: {
      ring: "ring-4 ring-yellow-400",
      badge: "bg-gradient-to-r from-yellow-400 to-amber-500",
      emoji: "👑",
      shadow: "shadow-2xl",
    },
    2: {
      ring: "ring-2 ring-gray-300",
      badge: "bg-gradient-to-r from-gray-300 to-gray-400",
      emoji: "🥈",
      shadow: "shadow-lg",
    },
    3: {
      ring: "ring-2 ring-amber-600",
      badge: "bg-gradient-to-r from-amber-600 to-amber-700",
      emoji: "🥉",
      shadow: "shadow-lg",
    },
  };

  const style = rankStyles[rank as 1 | 2 | 3] || rankStyles[3];

  // 1位用の大きいカード
  if (size === "large") {
    return (
      <div
        className={`
          relative bg-white rounded-2xl overflow-hidden
          ${style.ring} ${style.shadow} ${
            isClickable ? "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]" : ""
          }
        `}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
      >
        {/* 横並びレイアウト */}
        <div className="flex">
          {/* 画像（左側） */}
          <div className="relative w-1/2 aspect-[4/3] flex-shrink-0 overflow-hidden">
            {isExternal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={member.photoUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="160px"
              />
            )}
            
            {/* ランクバッジ */}
            <div
              className={`
                absolute top-2 left-2 z-10
                w-8 h-8 rounded-full ${style.badge}
                flex items-center justify-center
                text-white font-bold text-sm shadow-lg
              `}
            >
              {rank}
            </div>
          </div>

          {/* 情報エリア（右側） */}
          <div className="flex-1 p-5 flex flex-col justify-center space-y-3">
            {/* 名前とエモジ */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{style.emoji}</span>
              <h3 className="text-lg font-bold text-gray-800 leading-tight">{displayName}</h3>
            </div>

            {/* 属性タグ */}
            <div className="flex items-start gap-3">
              <AttributeTagList
                tags={member.tags}
                locale={locale}
                showAll
                direction="col"
              />
              {compatibilityText && (
                <div className="text-[11px] font-semibold text-gray-500 leading-tight pt-0.5">
                  {compatibilityText}
                </div>
              )}
            </div>

            {/* スコア表示は「相性%」に置換 */}
          </div>

      {xUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open(xUrl, "_blank", "noopener,noreferrer");
          }}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full border border-gray-200 bg-white/90 text-gray-600 hover:text-black hover:border-gray-300 transition flex items-center justify-center shadow"
          aria-label="Xアカウントを開く"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
      )}
        </div>
      </div>
    );
  }

  // 2位・3位用の小さいカード（miniはさらに縮小）
  if (size === "mini") {
    return (
      <div
        className={`
          relative bg-white rounded-lg overflow-hidden
          ring ring-gray-200 shadow ${
            isClickable ? "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]" : ""
          }
        `}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
      >
        <div className="flex h-20">
          <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden">
            {isExternal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photoUrl}
                alt={name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <Image
                src={member.photoUrl}
                alt={name}
                fill
                className="object-cover object-top"
                sizes="140px"
              />
            )}

            <div
              className="
                absolute top-1.5 left-1.5 z-10
                w-6 h-6 rounded-full bg-gray-300
                flex items-center justify-center
                text-white font-bold text-[10px] shadow
              "
            >
              {rank}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

            {!hideOverlayName && (
              <div className="absolute bottom-1.5 left-1.5 right-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-xs">✨</span>
                  <h3 className="text-xs font-bold text-white drop-shadow truncate">{displayName}</h3>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 h-full p-1 flex flex-col justify-start gap-0.5">
            <div className="flex items-center gap-1 justify-between -mt-1.5">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">#{rank}</span>
                <h3 className="text-sm font-semibold text-gray-800 truncate">{displayName}</h3>
              </div>
              <div className="flex flex-col items-center gap-0.5 text-[10px] text-gray-400 leading-tight mt-1">
                {xUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(xUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="shrink-0 w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 transition flex items-center justify-center"
                    aria-label="Xアカウントを開く"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                )}
                {compatibilityText && <div>{compatibilityText}</div>}
              </div>
            </div>
            <div className="-mt-2">
              <AttributeTagList tags={member.tags} locale={locale} size="sm" showAll />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative bg-white rounded-xl overflow-hidden
        ${style.ring} ${style.shadow} ${
          isClickable ? "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]" : ""
        }
      `}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      {/* 画像 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <Image
            src={member.photoUrl}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="180px"
          />
        )}
        
        {/* ランクバッジ */}
        <div
          className={`
            absolute top-2 left-2 z-10
            w-7 h-7 rounded-full ${style.badge}
            flex items-center justify-center
            text-white font-bold text-xs shadow-md
          `}
        >
          {rank}
        </div>

        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* 名前（画像上に表示） */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1">
            <span className="text-base">{style.emoji}</span>
            <h3 className="text-sm font-bold text-white drop-shadow-lg truncate">{displayName}</h3>
          </div>
        </div>
      </div>

      {/* 情報エリア（コンパクト） */}
      <div className="p-2 flex items-start justify-between gap-2">
        <AttributeTagList tags={member.tags} locale={locale} size="sm" showAll />
        <div className="flex flex-col items-center gap-1 text-[10px] text-gray-400 leading-tight">
          {xUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(xUrl, "_blank", "noopener,noreferrer");
              }}
              className="shrink-0 w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 transition flex items-center justify-center"
              aria-label="Xアカウントを開く"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          )}
          {compatibilityText && <div>{compatibilityText}</div>}
        </div>
      </div>
    </div>
  );
}
