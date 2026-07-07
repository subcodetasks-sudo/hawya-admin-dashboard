import DailyRequestsChart from "@/features/claude-usage/components/daily-requests-chart";
import TokenConsumptionChart from "@/features/claude-usage/components/token-consumption-chart";
import TopApiUsersTable from "@/features/claude-usage/components/top-api-users-table";
import UsageStatsGrid from "@/features/claude-usage/components/usage-stats-grid";

export default function ClaudeUsageOverview() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <UsageStatsGrid />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <TokenConsumptionChart />
        <DailyRequestsChart />
      </div>
      <TopApiUsersTable />
    </div>
  );
}
