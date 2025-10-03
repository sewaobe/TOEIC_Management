import { IconButton, Tooltip, Chip } from "@mui/material"
import { ArrowBack, MoreVert, People } from "@mui/icons-material"

interface Props {
  name: string
  description: string
  learnersCount?: number
  onBack: () => void
  onOpenMenu: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const TopicHeader = ({ name, description, learnersCount, onBack, onOpenMenu }: Props) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
      <IconButton onClick={onBack}>
        <ArrowBack />
      </IconButton>
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">{description}</p>
          {learnersCount !== undefined && (
            <Chip
              icon={<People sx={{ fontSize: 16 }} />}
              label={`${learnersCount} learners`}
              size="small"
              sx={{
                backgroundColor: "rgba(34,197,94,0.1)", // xanh lá nhạt
                color: "rgb(21,128,61)",
                fontWeight: 600,
                "& .MuiChip-label": { px: 1 },
                "& .MuiChip-icon": { color: "rgb(21,128,61)" },
              }}
            />
          )}
        </div>
      </div>
    </div>
    <Tooltip title="Xuất dữ liệu">
      <IconButton onClick={onOpenMenu}>
        <MoreVert />
      </IconButton>
    </Tooltip>
  </div>
)

export default TopicHeader
