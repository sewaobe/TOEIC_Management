import { useCallback } from "react";

export const useQuestionFormViewModel = (
  form: any,
  onChange: (field: string, value: any) => void,
  onChoiceChange: (key: string, value: string) => void
) => {
  const handleTextChange = useCallback(
    (value: string) => onChange("textQuestion", value),
    [onChange]
  );

  const handleChoiceChange = useCallback(
    (key: string, value: string) => onChoiceChange(key, value),
    [onChoiceChange]
  );

  const handleCorrectAnswerChange = useCallback(
    (value: string) => onChange("correctAnswer", value),
    [onChange]
  );

  const handlePlannedTimeChange = useCallback(
    (value: number) => onChange("planned_time", value),
    [onChange]
  );

  const handleExplanationChange = useCallback(
    (value: string) => onChange("explanation", value),
    [onChange]
  );

  const handleTagsChange = useCallback(
    (value: string[]) => onChange("tags", value),
    [onChange]
  );

  return {
    form,
    handleTextChange,
    handleChoiceChange,
    handleCorrectAnswerChange,
    handlePlannedTimeChange,
    handleExplanationChange,
    handleTagsChange,
  };
};
