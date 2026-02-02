import { Expense } from '@/hooks/useExpenses';
import { CategoryBadge } from './CategoryBadge';
import { format } from 'date-fns';
import { MapPin, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function ExpenseCard({ expense, onEdit, onDelete, className }: ExpenseCardProps) {
  return (
    <div className={cn("expense-card group", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <CategoryBadge category={expense.category} />
            <span className="text-sm text-muted-foreground">
              {format(new Date(expense.date), 'MMM d, yyyy')}
            </span>
          </div>
          
          {expense.description && (
            <p className="text-foreground font-medium truncate">
              {expense.description}
            </p>
          )}
          
          {expense.location_name && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{expense.location_name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="font-display text-xl font-bold text-foreground">
            ${Number(expense.amount).toFixed(2)}
          </span>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(expense)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(expense.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
