import AddIcon from "@mui/icons-material/Add"

interface Props {
  onAdd: () => void
}

export default function TopicHeader({ onAdd }: Props) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Chủ đề Từ vựng</h2>
        <p className="text-gray-600">Khám phá và quản lý các chủ đề từ vựng của bạn</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
      >
        <AddIcon sx={{ fontSize: 20 }} />
        <span className="hidden sm:inline">Thêm Chủ đề</span>
      </button>
    </div>
  )
}
