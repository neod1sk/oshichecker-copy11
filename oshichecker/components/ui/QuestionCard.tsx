"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Question, QuestionOption } from "@/lib/types";
import { Locale } from "@/i18n.config";
import { getLocalizedText } from "@/lib/utils";

const INDEX_KEYS = ["0-9", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

interface QuestionCardProps {
  question: Question;
  locale: Locale;
  onAnswer: (option: QuestionOption) => void;
  onToggleOption?: (option: QuestionOption, index: number) => void;
  selectedOptionIds?: string[];
  onSubmitMulti?: () => void;
  onSkipMulti?: () => void;
  canSubmitMulti?: boolean;
  maxReached?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  locale,
  onAnswer,
  onToggleOption,
  selectedOptionIds = [],
  onSubmitMulti,
  onSkipMulti,
  canSubmitMulti = true,
  maxReached = false,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const labels = {
    ja: {
      next: "次へ",
      skip: "スキップする",
      selected: (cur: number, max: number, min: number) => `${cur}/${max} 選択中（最低 ${min}）`,
      genreTitle: "好きなジャンル\n（※最大2つまで）",
    },
    ko: {
      next: "다음",
      skip: "건너뛰기",
      selected: (cur: number, max: number, min: number) => `${cur}/${max} 선택됨 (최소 ${min})`,
      genreTitle: "좋아하는 장르\n（*최대 2개）",
    },
    en: {
      next: "Next",
      skip: "Skip",
      selected: (cur: number, max: number, min: number) => `${cur}/${max} selected (min ${min})`,
      genreTitle: "Favorite Genres\n(up to 2)",
    },
  } as const;

  const l = labels[locale];

  const questionText =
    question.id === "q_genre_worldview" ? l.genreTitle : getLocalizedText(question, locale);
  const isMulti = question.type === "multi";
  const minSelect = question.minSelect ?? 1;
  const maxSelect = question.maxSelect ?? question.options.length;
  const isFaceAnimal = question.id === "q_face_animal";
  const prefixSizeClass = question.id === "q_genre_worldview" ? "text-base" : "text-sm";
  const showAlphaIndex = question.id === "q_cover_artist";

  type GroupedOption = {
    key: string;
    options: { option: QuestionOption; index: number; text: string }[];
  };

  const groupedOptions: GroupedOption[] = useMemo(() => {
    if (!showAlphaIndex) return [];

    const groups: GroupedOption[] = [];
    const groupOrder = new Map<string, number>();

    question.options.forEach((option, index) => {
      const optionText = getLocalizedText(option, locale) ?? "";
      const head = optionText.trim()[0] ?? "";
      const upperHead = head.toUpperCase();
      const key = /[A-Z]/.test(upperHead) ? upperHead : /[0-9]/.test(head) ? "0-9" : "0-9";

      if (!groupOrder.has(key)) {
        groupOrder.set(key, groups.length);
        groups.push({ key, options: [] });
      }

      const groupIndex = groupOrder.get(key);
      if (groupIndex !== undefined) {
        groups[groupIndex].options.push({ option, index, text: optionText });
      }
    });

    return groups;
  }, [locale, question.options, showAlphaIndex]);

  const availableIndexKeys = useMemo(() => {
    if (!showAlphaIndex) return new Set<string>();
    return new Set(groupedOptions.map((group) => group.key));
  }, [groupedOptions, showAlphaIndex]);

  const [activeIndexKey, setActiveIndexKey] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!showAlphaIndex) return;
    setActiveIndexKey(groupedOptions[0]?.key ?? null);
  }, [groupedOptions, showAlphaIndex]);

  useEffect(() => {
    if (!showAlphaIndex) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute("data-index-key");
            if (key) setActiveIndexKey(key);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [groupedOptions, showAlphaIndex]);

  const scrollToIndex = (key: string) => {
    if (!showAlphaIndex) return;
    const target = sectionRefs.current[key];
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderOptionButton = (
    option: QuestionOption,
    index: number,
    optionTextOverride?: string
  ) => {
    const optionText = optionTextOverride ?? getLocalizedText(option, locale);
    const optionId = option.id ?? String(index);
    const isSelected = selectedOptionIds.includes(optionId);
    const disableSelect = isMulti && maxReached && !isSelected;

    const iconSrc = isFaceAnimal && option.id ? `/images/animals/${option.id}.svg` : null;
    const prefix =
      question.id === "q_genre_worldview" ||
      question.id === "q_vibe_style" ||
      question.id === "q_performance_focus" ||
      question.id === "q_event_communication"
        ? String.fromCharCode(65 + index)
        : (optionText?.trim()?.[0] || String.fromCharCode(65 + index)).toUpperCase();

    const handleClick = () => {
      if (isMulti) {
        if (disableSelect) return;
        onToggleOption?.(option, index);
        return;
      }
      onAnswer(option);
    };

    return (
      <button
        key={index}
        onClick={handleClick}
        disabled={disableSelect}
        className={`w-full p-4 rounded-2xl text-left transition-all duration-200 border text-gray-700 font-medium ${
          isSelected
            ? "bg-orange-50 border-orange-300 shadow-md"
            : "bg-white/60 border-gray-200 hover:bg-white hover:border-orange-300 hover:shadow-md"
        } ${disableSelect ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span className="flex items-center gap-3">
          <span
            className={`w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 
                  flex items-center justify-center font-semibold text-orange-500 ${prefixSizeClass}`}
          >
            {iconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={iconSrc} alt={optionText} className="w-8 h-8 object-contain" />
            ) : (
              prefix
            )}
          </span>
          <span>{optionText}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="card p-6 w-full animate-scale-in">
      {/* 質問番号 */}
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
          Q{questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* 質問文 */}
    <h2
      className={`text-lg font-bold text-gray-800 text-center mb-6 leading-relaxed ${
        question.id === "q_cover_artist" ||
        question.id === "q_genre_worldview" ||
        question.id === "q_face_animal" ||
        question.id === "q_vibe_style" ||
        question.id === "q_performance_focus" ||
        question.id === "q_event_communication"
          ? "whitespace-pre-line"
          : ""
      }`}
    >
        {questionText}
      </h2>

      {isMulti && onSubmitMulti && (
        <div className="text-right mb-3 space-y-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSubmitMulti}
              disabled={!canSubmitMulti}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                canSubmitMulti
                  ? "bg-orange-500 text-white shadow hover:bg-orange-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {l.next}
            </button>
          </div>
          {onSkipMulti && (
            <button
              type="button"
              onClick={onSkipMulti}
              className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
            >
              {l.skip}
            </button>
          )}
        </div>
      )}

      {/* 選択肢 */}
      {showAlphaIndex ? (
        <div className="space-y-4">
          <div className="-mx-6 px-6 py-3 sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-orange-50">
            <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-gray-500">
              {INDEX_KEYS.map((key) => {
                const hasItems = availableIndexKeys.has(key);
                const isActive = activeIndexKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => hasItems && scrollToIndex(key)}
                    disabled={!hasItems}
                    aria-label={`${key}セクションへ移動`}
                    className={`px-1.5 py-0.5 rounded-full border transition ${
                      isActive
                        ? "bg-orange-500 text-white border-orange-500 shadow"
                        : hasItems
                          ? "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {groupedOptions.map((group) => (
              <div
                key={group.key}
                data-index-key={group.key}
                ref={(el) => {
                  sectionRefs.current[group.key] = el;
                }}
                className="space-y-3"
              >
                <div className="text-xs font-semibold text-gray-500">{group.key}</div>
                <div className="space-y-3">
                  {group.options.map((item) =>
                    renderOptionButton(item.option, item.index, item.text)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {question.options.map((option, index) => renderOptionButton(option, index))}
        </div>
      )}

      {isMulti && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {l.selected(selectedOptionIds.length, maxSelect, minSelect)}
          </div>
          <button
            type="button"
            onClick={onSubmitMulti}
            disabled={!canSubmitMulti}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              canSubmitMulti
                ? "bg-orange-500 text-white shadow hover:bg-orange-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {l.next}
          </button>
        </div>
      )}
    </div>
  );
}
