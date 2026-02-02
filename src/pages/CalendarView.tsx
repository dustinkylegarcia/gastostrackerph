import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Calendar } from '@/components/ui/calendar';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';
import { useExpenses } from '@/hooks/useExpenses';
import { format, isSameDay } from 'date-fns';
import { CalendarDays, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { expenses, deleteExpense } = useExpenses();

  // Get expenses for selected date
  const selectedDateExpenses = expenses.filter((expense) =>
    selectedDate && isSameDay(new Date(expense.date), selectedDate)
  );

  // Get dates that have expenses
  const expenseDates = expenses.map((expense) => new Date(expense.date));

  // Calculate total for selected date
  const dayTotal = selectedDateExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Calendar View</h1>
            <p className="text-muted-foreground mt-1">View expenses by date</p>
          </div>
          <AddExpenseDialog />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calendar */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full pointer-events-auto"
              modifiers={{
                hasExpense: expenseDates,
              }}
              modifiersStyles={{
                hasExpense: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationColor: 'hsl(var(--primary))',
                  textUnderlineOffset: '3px',
                },
              }}
            />
          </div>

          {/* Selected Day Expenses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h2>
                {selectedDate && (
                  <p className="text-muted-foreground">
                    {selectedDateExpenses.length} expense{selectedDateExpenses.length !== 1 ? 's' : ''} • 
                    Total: <span className="font-semibold text-foreground">${dayTotal.toFixed(2)}</span>
                  </p>
                )}
              </div>
            </div>

            {selectedDateExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-xl bg-card">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No expenses this day</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Add an expense for this date
                </p>
                <AddExpenseDialog
                  trigger={
                    <Button className="btn-gradient gap-2">
                      <Plus className="h-4 w-4" />
                      Add Expense
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {selectedDateExpenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDelete={(id) => deleteExpense.mutate(id)}
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
