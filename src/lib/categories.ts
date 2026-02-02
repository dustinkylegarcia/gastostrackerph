import { 
  Utensils, 
  Car, 
  Gamepad2, 
  ShoppingBag, 
  Zap, 
  Heart, 
  GraduationCap, 
  Plane, 
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';

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

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Record<ExpenseCategory, CategoryConfig> = {
  food: {
    label: 'Food & Dining',
    icon: Utensils,
    color: 'text-category-food',
    bgColor: 'bg-category-food/10',
  },
  transportation: {
    label: 'Transportation',
    icon: Car,
    color: 'text-category-transportation',
    bgColor: 'bg-category-transportation/10',
  },
  entertainment: {
    label: 'Entertainment',
    icon: Gamepad2,
    color: 'text-category-entertainment',
    bgColor: 'bg-category-entertainment/10',
  },
  shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'text-category-shopping',
    bgColor: 'bg-category-shopping/10',
  },
  utilities: {
    label: 'Utilities',
    icon: Zap,
    color: 'text-category-utilities',
    bgColor: 'bg-category-utilities/10',
  },
  healthcare: {
    label: 'Healthcare',
    icon: Heart,
    color: 'text-category-healthcare',
    bgColor: 'bg-category-healthcare/10',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    color: 'text-category-education',
    bgColor: 'bg-category-education/10',
  },
  travel: {
    label: 'Travel',
    icon: Plane,
    color: 'text-category-travel',
    bgColor: 'bg-category-travel/10',
  },
  other: {
    label: 'Other',
    icon: MoreHorizontal,
    color: 'text-category-other',
    bgColor: 'bg-category-other/10',
  },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([key, value]) => ({
  value: key as ExpenseCategory,
  ...value,
}));
