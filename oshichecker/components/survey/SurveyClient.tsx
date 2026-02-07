"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDiagnosis } from "@/context/DiagnosisContext";
import { Question, QuestionOption, Member, KoreanLevel } from "@/lib/types";
import { Locale } from "@/i18n.config";
import { scoreMembersBySurvey, getTopCandidates } from "@/lib/scoring";
import { CANDIDATE_COUNT } from "@/lib/types";
import ProgressBar from "@/components/ui/ProgressBar";
import QuestionCard from "@/components/ui/QuestionCard";

interface SurveyClientProps {
  questions: Question[];
  members: Member[];
  locale: Locale;
  dict: {
    loading: string;
    calculating: string;
  };
}

export default function SurveyClient({
  questions,
  members,
  locale,
  dict,
}: SurveyClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    answerQuestion,
    answerMulti,
    setCandidates,
    reset,
    setKoreanLevel,
    setPreferJapaneseSupport,
  } = useDiagnosis();
  const [isCalculating, setIsCalculating] = useState(false);
  const hasInitialized = useRef(false);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isLanguageCardCollapsed, setIsLanguageCardCollapsed] = useState(false);

  const t = {
    ja: {
      editLang: "言語設定を編集",
      summary: (_koreanLabel: string, preferOn: boolean) =>
        `日本語優先:${preferOn ? "ON" : "OFF"}`,
      open: "開く",
      koLevelTitle: "あなたの韓国語レベル",
      koLevelSub: "目安でOKです",
      collapse: "たたむ",
      preferTitle: "日本語対応が可能なアイドルを優先",
      on: "ON",
      off: "OFF",
      preferHint: "おすすめ：ON",
      koLevels: {
        none: "ほぼ話せない",
        beginner: "初級",
        intermediate: "中級",
        advanced: "上級",
        native: "ネイティブ",
      },
    },
    ko: {
      editLang: "언어 설정 편집",
      summary: (_koreanLabel: string, preferOn: boolean) =>
        `일본어 우선:${preferOn ? "ON" : "OFF"}`,
      open: "열기",
      koLevelTitle: "당신의 한국어 레벨",
      koLevelSub: "대략이면 OK",
      collapse: "접기",
      preferTitle: "일본어 대응이 가능한 아이돌을 우선",
      on: "ON",
      off: "OFF",
      preferHint: "추천: ON",
      koLevels: {
        none: "거의 못 함",
        beginner: "초급",
        intermediate: "중급",
        advanced: "상급",
        native: "네이티브",
      },
    },
    en: {
      editLang: "Edit language settings",
      summary: (koreanLabel: string, preferOn: boolean) =>
        `Korean: ${koreanLabel ?? "Not set"}`,
      open: "Open",
      koLevelTitle: "Your Korean level",
      koLevelSub: "A rough estimate is fine",
      collapse: "Collapse",
      preferTitle: "Prioritize idols with JP support",
      on: "ON",
      off: "OFF",
      preferHint: "Recommended: ON",
      koLevels: {
        none: "Hardly speak",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        native: "Native",
      },
    },
  } as const;

  const localeText = t[locale];

  const koreanLevelOptions: { value: KoreanLevel; label: string }[] = [
    { value: "none", label: localeText.koLevels.none },
    { value: "beginner", label: localeText.koLevels.beginner },
    { value: "intermediate", label: localeText.koLevels.intermediate },
    { value: "advanced", label: localeText.koLevels.advanced },
    { value: "native", label: localeText.koLevels.native },
  ];

  const recommendedPrefer =
    state.koreanLevel === "none" ||
    state.koreanLevel === "beginner" ||
    state.koreanLevel === "intermediate";

  // start=1 パラメータがある場合、または途中状態でない場合はリセット
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const isNewStart = searchParams.get("start") === "1";
    
    // 新規スタートの場合はリセット
    if (isNewStart) {
      reset();
      // URLからパラメータを削除
      router.replace(`/${locale}/survey`, { scroll: false });
    }
  }, [searchParams, reset, router, locale]);

  const currentQuestion = questions[state.currentQuestionIndex];
  const isMulti = currentQuestion?.type === "multi";
  const minSelect = currentQuestion?.minSelect ?? 1;
  const maxSelect = currentQuestion?.maxSelect ?? (currentQuestion?.options.length ?? 1);
  const isComplete = state.currentQuestionIndex >= questions.length;

  // 質問に回答
  const handleAnswer = (option: QuestionOption) => {
    if (isMulti) return;
    const scoreValue = option.scoreValue ?? 1;
    answerQuestion(option.scoreKey, scoreValue);
  };

  // 複数選択のトグル
  const handleToggleOption = (option: QuestionOption, idx: number) => {
    const optionId = option.id ?? option.scoreKey ?? String(idx);
    setSelectedOptionIds((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      }
      if (prev.length >= maxSelect) return prev;
      return [...prev, optionId];
    });
  };

  // 複数選択の送信
  const handleSubmitMulti = () => {
    if (!currentQuestion) return;
  if (selectedOptionIds.length < minSelect) return;
    const selectedOptions = currentQuestion.options.filter((opt, idx) => {
      const optionId = opt.id ?? opt.scoreKey ?? String(idx);
      return selectedOptionIds.includes(optionId);
    });

    const mergedScores = selectedOptions.reduce<Record<string, number>>((acc, opt) => {
      const scores = opt.scores ?? { [opt.scoreKey]: opt.scoreValue ?? 1 };
      for (const [key, val] of Object.entries(scores)) {
        acc[key] = (acc[key] || 0) + val;
      }
      return acc;
    }, {});

    setSelectedOptionIds([]);
    answerMulti(mergedScores);
  };

const handleSkipMulti = () => {
  setSelectedOptionIds([]);
  answerMulti({});
};

  const handleKoreanLevelChange = (level: KoreanLevel) => {
    setKoreanLevel(level);
    setIsLanguageCardCollapsed(true);
  };

  const handlePreferToggle = (value: boolean) => {
    setPreferJapaneseSupport(value);
    setIsLanguageCardCollapsed(true);
  };

  // 質問が変わったら選択をリセット
  useEffect(() => {
    setSelectedOptionIds([]);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.currentQuestionIndex]);

  // アンケート完了時の処理
  useEffect(() => {
    if (isComplete && !isCalculating && state.candidates.length === 0) {
      setIsCalculating(true);

      // スコアリング実行
      const scored = scoreMembersBySurvey(members, state.surveyScores);
      const topCandidates = getTopCandidates(scored, CANDIDATE_COUNT);

      // 候補をセット
      setCandidates(topCandidates);

      // 少し待ってからバトルページへ遷移
      setTimeout(() => {
        router.push(`/${locale}/battle`);
      }, 800);
    }
  }, [isComplete, isCalculating, members, state.surveyScores, state.candidates.length, setCandidates, router, locale]);

  // 既にバトルに進んでいる場合はバトルページへリダイレクト
  useEffect(() => {
    if (state.candidates.length > 0 && state.currentBattleRound < 10) {
      router.push(`/${locale}/battle`);
    }
  }, [state.candidates.length, state.currentBattleRound, router, locale]);

  // 計算中の表示
  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="card p-8 w-full max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 
            flex items-center justify-center animate-pulse">
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-gray-600 font-medium">{dict.calculating}</p>
        </div>
      </div>
    );
  }

  // 質問がない場合
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">{dict.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[75vh] py-4">
      {/* プログレスバー */}
      <div className="w-full max-w-sm mb-6">
        <ProgressBar
          current={state.currentQuestionIndex + 1}
          total={questions.length}
          locale={locale}
        />
      </div>

      {/* 言語設定（折りたたみ可能） */}
      {locale !== "en" && (
        <div className="w-full max-w-sm mb-4">
          {isLanguageCardCollapsed ? (
            <button
              type="button"
              onClick={() => setIsLanguageCardCollapsed(false)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm text-sm text-gray-700 hover:border-orange-200 transition"
            >
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold">{localeText.editLang}</span>
                <span className="text-xs text-gray-500">
                  {localeText.summary(
                    koreanLevelOptions.find((o) => o.value === state.koreanLevel)?.label ?? "",
                    state.preferJapaneseSupport
                  )}
                </span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                {localeText.open}
              </span>
            </button>
          ) : (
            <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
              <div className="flex items-center justify-end mb-3">
                <button
                  type="button"
                  onClick={() => setIsLanguageCardCollapsed(true)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                  {localeText.collapse}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {localeText.preferTitle}
                    </p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer gap-2">
                    <span
                      className={`text-xs font-semibold w-8 text-right ${
                        state.preferJapaneseSupport ? "text-orange-600" : "text-gray-500"
                      }`}
                    >
                      {state.preferJapaneseSupport ? localeText.on : localeText.off}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={state.preferJapaneseSupport}
                      onChange={(e) => handlePreferToggle(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-400 transition-colors">
                      <div
                        className={`h-5 w-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ml-0.5 ${
                          state.preferJapaneseSupport ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 質問カード */}
      <div className="w-full max-w-sm" key={state.currentQuestionIndex}>
        <QuestionCard
          question={currentQuestion}
          locale={locale}
          onAnswer={handleAnswer}
          onToggleOption={
            isMulti
              ? (option, idx) => handleToggleOption(option, idx)
              : undefined
          }
          selectedOptionIds={isMulti ? selectedOptionIds : undefined}
          onSubmitMulti={isMulti ? handleSubmitMulti : undefined}
          onSkipMulti={
            isMulti && (state.currentQuestionIndex <= 2 || state.currentQuestionIndex === 5)
              ? handleSkipMulti
              : undefined
          }
          canSubmitMulti={
            !isMulti ||
            (selectedOptionIds.length >= minSelect && selectedOptionIds.length <= maxSelect)
          }
          maxReached={isMulti && selectedOptionIds.length >= maxSelect}
          questionNumber={state.currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      </div>

      {/* リセットボタン */}
      <button
        onClick={() => {
          reset();
        setSelectedOptionIds([]);
          router.push(`/${locale}`);
        }}
        className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        {locale === "ko" ? "처음부터 다시" : locale === "en" ? "Start over" : "最初からやり直す"}
      </button>
    </div>
  );
}
