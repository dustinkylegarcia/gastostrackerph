import { CATEGORIES, ExpenseCategory } from '@/lib/categories';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = CATEGORIES[category];
  const Icon = config.icon;

  return (
    <span className={cn(
      "category-badge",
      config.bgColor,
      config.color,
      className
    )}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
