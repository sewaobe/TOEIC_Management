import { CommentItem } from "../features/Dashboard/components/RecentCommentDashboard"

export const commentService = {
    getRecentCommentDashboard: async (page = 1, limit = 5): Promise<{
        items: CommentItem[]
        total: number
        page: number
        pageCount: number
    }> => {
        const mockComments: CommentItem[] = Array.from({ length: 50 }, (_, i) => {
            const types = ["test", "lesson"] as const
            const randomType = types[Math.floor(Math.random() * types.length)]
            const names = [
                "Nguyễn Văn",
                "Trần Thị",
                "Phạm Văn",
                "Lê Thị",
                "Đỗ Văn",
                "Võ Thị",
                "Hoàng Văn",
                "Phan Thị",
            ]
            const name = `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}`
            const avatars = name
                .split(" ")
                .filter((s) => s.length > 0)
                .map((s) => s[0])
                .join("")
                .slice(0, 2)
            const contents = {
                lesson: [
                    "Phần học rất dễ hiểu, cảm ơn đội ngũ phát triển!",
                    "App thân thiện và giao diện đẹp mắt.",
                    "Cần thêm phần học theo chủ đề chuyên sâu hơn.",
                    "Phần phát âm rất hay, mong có thêm giọng Anh-Mỹ.",
                ],
                test: [
                    "Khi nào sẽ có phần học theo level TOEIC?",
                    "Cần đăng ký tài khoản cộng tác viên ở đâu?",
                    "Có thể xuất chứng chỉ học tập không?",
                    "Phần ôn tập có tự động cập nhật không?",
                ],
            }
            const messages = contents[randomType]
            const content = messages[i % messages.length]
            const times = [
                "1 giờ trước",
                "2 giờ trước",
                "3 giờ trước",
                "5 giờ trước",
                "1 ngày trước",
                "2 ngày trước",
                "3 ngày trước",
            ]
            const time = times[Math.floor(Math.random() * times.length)]

            return {
                id: (i + 1).toString(),
                user: name,
                content,
                time,
                avatar: avatars.toUpperCase(),
                type: randomType,
            }
        })
        const total = mockComments.length
        const pageCount = Math.ceil(total / limit)
        const start = (page - 1) * limit
        const end = start + limit
        const items = mockComments.slice(start, end)

        // 🕒 Giả lập delay mạng
        await new Promise((r) => setTimeout(r, 500))

        return { items, total, page, pageCount }
    }
}