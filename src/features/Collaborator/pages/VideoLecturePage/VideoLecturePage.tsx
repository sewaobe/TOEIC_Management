"use client";

import FloatingWindow from "../../../../components/FloatingWindow";
import VideoLecturePageContent from "./VideoLecturePageContent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../stores/store";
import {
  openVideoManager,
  closeVideoManager,
} from "../../../../stores/floatingWindowSlice";

export default function VideoLecturePage() {
  const dispatch = useDispatch();
  const isFloatingGlobal = useSelector(
    (state: RootState) => state.floatingWindow.isVideoManagerOpen
  );

  // ✅ Nếu đang mở cửa sổ global (FloatingWindowManager), thì ẩn bản local đi
  if (isFloatingGlobal) return null;

  return (
    <FloatingWindow
      title="🎥 Trình quản lý Video"
      width="80vw"
      height="80vh"
      defaultFloating={false}
      onFloatChange={(isFloat: boolean) => {
        if (isFloat) dispatch(openVideoManager());
        else dispatch(closeVideoManager());
      }}
    >
      <VideoLecturePageContent />
    </FloatingWindow>
  );
}
