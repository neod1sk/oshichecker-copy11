"use client";

import Image from "next/image";
import { Member } from "@/lib/types";
import { Locale } from "@/i18n.config";
import { getLocalizedName, isExternalUrl } from "@/lib/utils";

interface MemberBattleCardProps {
  member: Member;
  locale: Locale;
  onSelect: () => void;
  isSelected?: boolean;
  isLoser?: boolean;
  position: "left" | "right";
}

export default function MemberBattleCard({
  member,
  locale,
  onSelect,
  isSelected = false,
  isLoser = false,
  position,
}: MemberBattleCardProps) {
  const name = getLocalizedName(member, locale);
  const isExternal = isExternalUrl(member.photoUrl);

  return (
    <button
      onClick={onSelect}
      disabled={isSelected || isLoser}
      className={`
        relative w-full aspect-[16/9] rounded-3xl overflow-hidden
        transition-all duration-300 ease-out
        ${isSelected 
          ? "ring-4 ring-orange-400 scale-105 shadow-2xl z-10" 
          : isLoser 
          ? "opacity-40 scale-95 grayscale" 
          : "hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        }
        ${position === "left" ? "origin-right" : "origin-left"}
      `}
    >
      {/* 画像 */}
      <div className="absolute inset-0">
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
            sizes="(max-width: 768px) 45vw, 200px"
          />
        )}
      </div>

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* 名前 */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-bold text-lg drop-shadow-lg text-center">
          {name}
        </p>
      </div>

      {/* 選択エフェクト */}
      {isSelected && (
        <div className="absolute inset-0 bg-orange-400/20 flex items-center justify-center">
          <span className="text-4xl animate-bounce">💖</span>
        </div>
      )}
    </button>
  );
}
