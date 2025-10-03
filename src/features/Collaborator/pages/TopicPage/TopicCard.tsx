import { motion } from "framer-motion"
import { Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PeopleIcon from "@mui/icons-material/People"
import UpdateIcon from "@mui/icons-material/Update"
import { Topic } from "../../../../types/Topic"
import { getIconInfoByName, mapBgToIconColor } from "../../../../utils/colorMapFromBg"
import { formatDate } from "../../../../utils/formatDate"
import { useState } from "react"

interface TopicCardProps {
    topic: Topic
    onView: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

export default function TopicCard({ topic, onView, onEdit, onDelete }: TopicCardProps) {
    const IconComponent = getIconInfoByName(topic.iconName)?.icon;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    return (
        <motion.div
            key={topic.id}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl cursor-pointer group relative flex flex-col h-[400px] w-full sm:w-[300px]"
        >
            {/* Gradient Header */}
            <div className={`h-32 bg-gradient-to-br ${topic.gradient} relative overflow-hidden`}
                onClick={() => onView(topic.id)}
            >
                <div className="absolute top-4 right-4">
                    {topic.new && (
                        <Tooltip title="new" arrow>
                            <Chip
                                icon={<TrendingUpIcon sx={{ fontSize: 16, color: "#2563EB" }} />}
                                label="New"
                                size="small"
                                sx={{
                                    backgroundColor: "white",
                                    color: "#2563EB",
                                    fontWeight: 700,
                                    border: "1px solid #2563EB",
                                    "& .MuiChip-label": {
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                    },
                                }}
                            />
                        </Tooltip>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                        {IconComponent && (
                            <IconComponent
                                className={mapBgToIconColor(topic.bgColor)}
                                sx={{ fontSize: 32 }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 pt-4 flex-1"
                onClick={() => onView(topic.id)}
            >
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors leading-tight">
                    {topic.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{topic.description}</p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {/* Words Chip */}
                    <Chip
                        label={`${topic.wordCount} words`}
                        size="small"
                        sx={{
                            backgroundColor: "rgba(59, 130, 246, 0.1)", // blue-500/10
                            color: "rgb(37, 99, 235)", // blue-600
                            fontWeight: 600,
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            "& .MuiChip-label": {
                                px: 1.5,
                                fontSize: "0.813rem",
                            },
                        }}
                    />

                    {/* Active Learners Chip */}
                    <Chip
                        icon={<PeopleIcon sx={{ fontSize: 14, color: "rgb(22 163 74)" }} />}
                        label={`${topic.learnerCount} learners`}
                        size="small"
                        sx={{
                            backgroundColor: "rgba(34, 197, 94, 0.1)", // green-500/10
                            color: "rgb(21, 128, 61)", // green-700
                            fontWeight: 600,
                            border: "1px solid rgba(34, 197, 94, 0.2)",
                            "& .MuiChip-label": {
                                px: 1.5,
                                fontSize: "0.813rem",
                            },
                        }}
                    />

                    {/* Last Updated Chip */}
                    <Chip
                        icon={<UpdateIcon sx={{ fontSize: 14, color: "rgb(107 114 128)" }} />}
                        label={`Updated ${topic.updatedAt === "" ? formatDate(topic.createdAt) : formatDate(topic.updatedAt)}`}
                        size="small"
                        sx={{
                            backgroundColor: "rgba(107, 114, 128, 0.08)", // gray-500/8
                            color: "rgb(55 65 81)", // gray-700
                            fontWeight: 500,
                            border: "1px solid rgba(107, 114, 128, 0.2)",
                            "& .MuiChip-label": {
                                px: 1.5,
                                fontSize: "0.813rem",
                            },
                        }}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onView(topic.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <VisibilityIcon sx={{ fontSize: 18 }} />
                        View
                    </motion.button>
                    {/* Menu 3 chấm */}
                    <IconButton
                        onClick={handleMenuOpen}
                        className="bg-gray-100 hover:bg-gray-200"
                        sx={{ width: 42, height: 42, borderRadius: "12px" }}
                    >
                        <MoreVertIcon sx={{ fontSize: 22, color: "rgb(55 65 81)" }} />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: { borderRadius: "12px", minWidth: 160, p: 1 }
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                onEdit(topic.id)
                                handleMenuClose()
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                onDelete(topic.id)
                                handleMenuClose()
                            }}
                            sx={{ color: "red.600" }}
                        >
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </motion.div>
    )
}
