"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Banner = {
  photoUrl: string;
  blogUrl: string;
};

// 12枚のバナー定義
const BANNERS: Banner[] = [
  {
    photoUrl: "https://assets.st-note.com/img/1769115425-f3ldIDgXo2Ahtx5ZTybYieN1.jpg",
    blogUrl: "https://note.com/daisuke_001/n/nfc67010344d6",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115432-ZS2wq1OIs0baeRPCHoYpmlg4.png",
    blogUrl: "https://note.com/daisuke_001/n/n6073a1e5767d",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115441-yRf2eulmxNLJ1tY4MviQUFPs.jpg",
    blogUrl: "https://note.com/daisuke_001/n/nfbf263c544ad",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115455-GMeb1ysAudmH9nBcTY3vUDxZ.jpg",
    blogUrl: "https://note.com/daisuke_001/n/nb713122229df",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115462-Pzbkr7KtQBZCv2R36oun0yim.jpg",
    blogUrl: "https://note.com/daisuke_001/n/n35087657973d",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115468-JzsQXnB40Wp8Oalte2NfyURj.jpg",
    blogUrl: "https://note.com/daisuke_001/n/n4bcf875cf973",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115476-LbjAMoYndIg4k2Fu0BNQCUyV.jpg",
    blogUrl: "https://note.com/daisuke_001/n/n9702a74d4e71",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115482-qQ2GlUJy9vgSWNkzB7Xuf10o.png",
    blogUrl: "https://note.com/daisuke_001/n/n82199030fbe2",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115630-5NMZs96TDE84ley2maACUWxG.jpg",
    blogUrl: "https://note.com/daisuke_001/n/n7339733b5c84",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115396-N619lz4VrWnTULCAmsHvf8OS.jpg",
    blogUrl: "https://note.com/daisuke_001/n/n8f8fe49ba70c",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115413-nfrOmsHB7eqW0UFyw4Vul1EZ.png",
    blogUrl: "https://note.com/daisuke_001/n/ne8e595bdcf80",
  },
  {
    photoUrl: "https://assets.st-note.com/img/1769115420-zSj9XuDViWGkBeIac6LxNq7C.jpg",
    blogUrl: "https://note.com/daisuke_001/n/nb228f4c7b204",
  },
];

const ROTATION_INTERVAL_MS = 4500;

export function BlogBannerRotator({ label }: { label?: string } = {}) {
  // 初期表示をランダム開始にするため、マウント時に決定
  const initialIndex = useMemo(() => Math.floor(Math.random() * BANNERS.length), []);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const current = BANNERS[currentIndex];
  const heading = label || "おすすめブログ";

  return (
    <div className="mt-4 w-full max-w-sm mx-auto">
      <div className="text-xs text-gray-500 mb-2 text-center">{heading}</div>
      <Link
        href={current.blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group focus:outline-none"
        aria-label="ブログ記事を新しいタブで開く"
      >
        <div
          className="overflow-hidden rounded-xl ring-1 ring-gray-200 shadow transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-pink-300"
          style={{ minHeight: 120 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.photoUrl}
            alt="ブログバナー"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.01]"
            loading="lazy"
          />
        </div>
      </Link>
    </div>
  );
}
