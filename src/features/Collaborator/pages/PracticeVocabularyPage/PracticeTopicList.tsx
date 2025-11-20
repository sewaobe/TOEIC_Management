import PaginationContainer from "../../../../components/PaginationContainer";
import PracticeTopicCard from "./PracticeTopicCard";
import { PracticeTopicVocabulary } from "../../../../types/PracticeVocabulary";

interface PracticeTopicListProps {
  topics: PracticeTopicVocabulary[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PracticeTopicList({
  topics,
  page,
  pageCount,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: PracticeTopicListProps) {
  return (
    <PaginationContainer
      items={topics}
      page={page}
      pageCount={pageCount}
      onPageChange={onPageChange}
      renderItem={(topic) => (
        <PracticeTopicCard
          key={topic._id}
          topic={topic}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}
