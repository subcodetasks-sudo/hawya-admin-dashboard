import ApiUsageChart from "@/features/dashboard/components/api-usage-chart";
import PlatformStatsGrid from "@/features/dashboard/components/platform-stats-grid";
import RecentPaymentsTable from "@/features/dashboard/components/recent-payments-table";
import RevenueTrendChart from "@/features/dashboard/components/revenue-trend-chart";
import StatsGrid from "@/features/dashboard/components/stats-grid";
import SubscribersByPlanChart from "@/features/dashboard/components/subscribers-by-plan-chart";

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <StatsGrid />
      <PlatformStatsGrid />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <SubscribersByPlanChart />
        <RevenueTrendChart />
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <RecentPaymentsTable />
        <ApiUsageChart />
      </div>
    </div>
  );
}
