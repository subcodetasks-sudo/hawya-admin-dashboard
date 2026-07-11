import AiBudgetCard from "@/features/claude-usage/components/ai-budget-card";
import TopApiUsersTable from "@/features/claude-usage/components/top-api-users-table";
import UsageStatsGrid from "@/features/claude-usage/components/usage-stats-grid";
import UsageTrendChart from "@/features/claude-usage/components/usage-trend-chart";

export default function ClaudeUsageOverview() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <UsageStatsGrid />
      <AiBudgetCard />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <UsageTrendChart metric="tokens" />
        <UsageTrendChart metric="requests" />
      </div>
      <TopApiUsersTable />
    </div>
  );
}
