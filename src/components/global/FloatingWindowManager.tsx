import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores/store";
import { closeVideoManager } from "../../stores/floatingWindowSlice";
import FloatingWindow from "../FloatingWindow";
import VideoLecturePageContent from "../../features/Collaborator/pages/VideoLecturePage/VideoLecturePageContent";

export default function FloatingWindowManager() {
  const dispatch = useDispatch();

  // ✅ Lấy trạng thái từ Redux
  const isVideoManagerOpen = useSelector(
    (state: RootState) => state.floatingWindow.isVideoManagerOpen
  );

  // ❌ Nếu chưa mở thì không render
  if (!isVideoManagerOpen) return null;

  return (
    <FloatingWindow
      title="🎥 Trình quản lý Video"
      width="80vw"
      height="80vh"
      defaultFloating={true}
      onClose={() => dispatch(closeVideoManager())}
      onFloatChange={(isFloat) => {
        if (!isFloat) dispatch(closeVideoManager());
      }}
    >
      <div style={{ height: "100%", overflow: "auto", paddingBottom: "80px" }}>
        <VideoLecturePageContent />
      </div>
    </FloatingWindow>
  );
}
