import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseCategory, CATEGORIES } from '@/lib/categories';

interface CategoryChartProps {
  data: Record<ExpenseCategory, number>;
}

const COLORS: Record<ExpenseCategory, string> = {
  food: '#f97316',
  transportation: '#3b82f6',
  entertainment: '#a855f7',
  shopping: '#ec4899',
  utilities: '#06b6d4',
  healthcare: '#ef4444',
  education: '#6366f1',
  travel: '#10b981',
  other: '#71717a',
};

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: CATEGORIES[key as ExpenseCategory].label,
      value,
      color: COLORS[key as ExpenseCategory],
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No expense data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-sm text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
