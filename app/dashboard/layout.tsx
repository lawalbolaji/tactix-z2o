import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-auto">
        <Sidebar />
        <main className="flex-1 pt-14 overflow-hidden">{children}</main>
      </div>
    </>
  );
}
