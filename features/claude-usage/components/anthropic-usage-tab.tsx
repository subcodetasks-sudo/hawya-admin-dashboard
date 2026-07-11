import AnthropicBalanceCard from "@/features/claude-usage/components/anthropic-balance-card";
import AnthropicDailyCostChart from "@/features/claude-usage/components/anthropic-daily-cost-chart";
import AnthropicDailyUsageChart from "@/features/claude-usage/components/anthropic-daily-usage-chart";
import AnthropicReportSection from "@/features/claude-usage/components/anthropic-report-section";
import AnthropicStatsGrid from "@/features/claude-usage/components/anthropic-stats-grid";
import AnthropicWorkspacesTable from "@/features/claude-usage/components/anthropic-workspaces-table";

export default function AnthropicUsageTab() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <AnthropicStatsGrid />
      <AnthropicBalanceCard />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <AnthropicDailyCostChart />
        <AnthropicDailyUsageChart />
      </div>
      <AnthropicWorkspacesTable />
      <AnthropicReportSection />
    </div>
  );
}
