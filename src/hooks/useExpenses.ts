import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type ExpenseCategory = 
  | 'food' 
  | 'transportation' 
  | 'entertainment' 
  | 'shopping' 
  | 'utilities' 
  | 'healthcare' 
  | 'education' 
  | 'travel' 
  | 'other';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  description: string | null;
  date: string;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseInput {
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
}

export function useExpenses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user,
  });

  const createExpense = useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add expense: ' + error.message);
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Expense> & { id: string }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated');
    },
    onError: (error) => {
      toast.error('Failed to update expense: ' + error.message);
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete expense: ' + error.message);
    },
  });

  return {
    expenses,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}

export function useExpenseStats() {
  const { expenses } = useExpenses();

  const totalThisMonth = expenses
    .filter(e => {
      const date = new Date(e.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalLastMonth = expenses
    .filter(e => {
      const date = new Date(e.date);
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const byCategory = expenses.reduce((acc, expense) => {
    const cat = expense.category;
    acc[cat] = (acc[cat] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const recentExpenses = expenses.slice(0, 5);

  const monthlyChange = totalLastMonth > 0 
    ? ((totalThisMonth - totalLastMonth) / totalLastMonth * 100).toFixed(1)
    : '0';

  return {
    totalThisMonth,
    totalLastMonth,
    byCategory,
    recentExpenses,
    monthlyChange,
    totalExpenses: expenses.length,
  };
}
