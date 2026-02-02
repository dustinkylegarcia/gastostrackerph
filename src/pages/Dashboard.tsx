import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';
import { useExpenses, useExpenseStats } from '@/hooks/useExpenses';
import { Wallet, TrendingUp, Receipt, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { expenses, isLoading, deleteExpense } = useExpenses();
  const stats = useExpenseStats();

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track and manage your expenses</p>
          </div>
          <AddExpenseDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="This Month"
            value={`$${stats.totalThisMonth.toFixed(2)}`}
            icon={Wallet}
            trend={{
              value: stats.monthlyChange,
              positive: parseFloat(stats.monthlyChange) < 0,
            }}
          />
          <StatCard
            title="Last Month"
            value={`$${stats.totalLastMonth.toFixed(2)}`}
            subtitle="Previous period"
            icon={Calendar}
          />
          <StatCard
            title="Total Expenses"
            value={stats.totalExpenses.toString()}
            subtitle="All time entries"
            icon={Receipt}
          />
          <StatCard
            title="Top Category"
            value={
              Object.keys(stats.byCategory).length > 0
                ? Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
                : 'N/A'
            }
            subtitle="Most spent on"
            icon={TrendingUp}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Expenses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Recent Expenses</h2>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl">
                <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No expenses yet</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Start tracking your spending by adding your first expense
                </p>
                <AddExpenseDialog />
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 8).map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={(id) => deleteExpense.mutate(id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Spending by Category</h2>
            <div className="bg-card border border-border rounded-2xl p-4">
              <CategoryChart data={stats.byCategory} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
