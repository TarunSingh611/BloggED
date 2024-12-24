// app/dashboard/page.tsx
import DashboardTabs from '@/components/DashboardTabs'

export default async function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <DashboardTabs />
    </div>
  )
}