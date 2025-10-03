import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"
import { Edit } from "@mui/icons-material"

interface Props {
  open: boolean
  word: string
  definition: string
  onContinue: () => void
  onDiscard: () => void
  onClose: () => void
}

const DraftWarningDialog = ({ open, word, definition, onContinue, onDiscard, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 rounded-full p-2">
            <Edit className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Bạn đang có dữ liệu chưa lưu</h3>
            <p className="text-sm text-gray-600 mt-1">Bạn muốn tiếp tục nhập hay bắt đầu lại?</p>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            <strong>Từ vựng:</strong> {word || "(Chưa nhập)"}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <strong>Định nghĩa:</strong> {definition || "(Chưa nhập)"}
          </p>
        </div>
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button
          onClick={onDiscard}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#EF4444",
            "&:hover": { backgroundColor: "#FEE2E2" },
          }}
        >
          Xóa và bắt đầu lại
        </Button>
        <Button
          onClick={onContinue}
          variant="contained"
          sx={{
            backgroundColor: "#2563EB",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          Tiếp tục nhập
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DraftWarningDialog
