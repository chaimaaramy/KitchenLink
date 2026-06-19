import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function PageLayout() {
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      <Outlet />
      <BottomNav />
    </div>
  );
}
