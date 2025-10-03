import PaginationContainer from "../../../../components/PaginationContainer"
import TopicCard from "./TopicCard"
import { Topic } from "../../../../types/Topic"

interface Props {
  topics: Topic[]
  page: number
  pageCount: number
  onPageChange: (p: number) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function TopicList({
  topics,
  page,
  pageCount,
  onPageChange,
  onView,
  onEdit,
  onDelete
}: Props) {
  return (
    <PaginationContainer
      items={topics}
      page={page}
      pageCount={pageCount}
      onPageChange={onPageChange}
      renderItem={(topic) => <TopicCard
        key={topic.id}
        topic={topic}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />}
    />
  )
}
