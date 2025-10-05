"use client";

import FloatingWindow from "../../../../components/FloatingWindow";
import VideoLecturePageContent from "./VideoLecturePageContent";

export default function VideoLecturePage() {
  return (
    <FloatingWindow title="🎥 Trình quản lý Video" width="80vw" height="80vh">
      <VideoLecturePageContent />
    </FloatingWindow>
  );
}
