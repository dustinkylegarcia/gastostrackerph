import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';
import { useExpenses } from '@/hooks/useExpenses';
import { MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function MapView() {
  const { expenses, deleteExpense } = useExpenses();
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  // Filter expenses with locations
  const expensesWithLocation = expenses.filter(
    (expense) => expense.location_name
  );

  const selectedExpense = expenses.find((e) => e.id === selectedExpenseId);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Map View</h1>
            <p className="text-muted-foreground mt-1">
              View expenses by location
            </p>
          </div>
          <AddExpenseDialog />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map placeholder - in a real app, this would be Google Maps */}
          <div className="relative bg-card border border-border rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[600px]">
            {/* Map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="absolute inset-0 opacity-10" 
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              />
            </div>

            {/* Location markers */}
            <div className="absolute inset-0 p-8">
              {expensesWithLocation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No locations yet</h3>
                  <p className="text-muted-foreground mt-1 max-w-xs">
                    Add a location to your expenses to see them on the map
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full content-start">
                  {expensesWithLocation.map((expense, index) => (
                    <button
                      key={expense.id}
                      onClick={() => setSelectedExpenseId(expense.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl transition-all",
                        "bg-card/80 backdrop-blur-sm border border-border",
                        "hover:shadow-lg hover:scale-105",
                        selectedExpenseId === expense.id && "ring-2 ring-primary shadow-lg"
                      )}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-medium text-center line-clamp-2">
                        {expense.location_name}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        ${Number(expense.amount).toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  <span>
                    {expensesWithLocation.length} location{expensesWithLocation.length !== 1 ? 's' : ''} with expenses
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Expense list */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">
              {selectedExpense ? 'Selected Expense' : 'All Location Expenses'}
            </h2>

            {selectedExpense ? (
              <div className="space-y-3">
                <ExpenseCard
                  expense={selectedExpense}
                  onDelete={(id) => {
                    deleteExpense.mutate(id);
                    setSelectedExpenseId(null);
                  }}
                />
                <button
                  onClick={() => setSelectedExpenseId(null)}
                  className="text-sm text-primary hover:underline"
                >
                  ← Show all locations
                </button>
              </div>
            ) : expensesWithLocation.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl bg-card">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No location data</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Add locations when creating expenses
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {expensesWithLocation.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={(id) => deleteExpense.mutate(id)}
                    className={cn(
                      "cursor-pointer",
                      selectedExpenseId === expense.id && "ring-2 ring-primary"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
