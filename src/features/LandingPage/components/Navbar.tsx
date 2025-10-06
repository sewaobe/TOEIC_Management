import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
    onNavigate: (index: number) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
    const navigate = useNavigate();
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div
                className="font-bold text-lg tracking-wide text-indigo-700 cursor-pointer"
                onClick={() => onNavigate(0)}
            >
                TOEIC Master
            </div>
            <ul className="hidden md:flex items-center gap-8 text-sm text-gray-700">
                <li
                    className="hover:text-indigo-600 cursor-pointer transition"
                    onClick={() => onNavigate(1)}
                >
                    Lợi ích
                </li>
                <li
                    className="hover:text-indigo-600 cursor-pointer transition"
                    onClick={() => onNavigate(2)}
                >
                    Hướng dẫn
                </li>
                <li
                    className="hover:text-indigo-600 cursor-pointer transition"
                    onClick={() => onNavigate(3)}
                >
                    Câu hỏi thường gặp
                </li>
            </ul>
            <Button
                variant="contained"
                sx={{
                    background: "linear-gradient(to right, #6366f1, #22d3ee)",
                    textTransform: "none",
                    borderRadius: "9999px",
                    px: 3,
                }}
                onClick={() => navigate("/auth")}
            >
                Login
            </Button>
        </nav>
    );
}
