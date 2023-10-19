import { Database, Json } from "./database.types";

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  image?: string;
  images?: string[];
  count: number;
  brand: string;
  category: string;
  subCategory: string;
  productDetails: Json;
  avgRating?: number;
  ratings?: number;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
  product_id: string;
};

export const OrderStatusList: OrderStatus[] = [
  "New",
  "Preparing",
  "Delivering",
  "Delivered",
];

export type OrderStatus = "New" | "Preparing" | "Delivering" | "Delivered";

export type Order = {
  id: string;
  created_at: string;
  total: number;
  user_id: string;
  status: OrderStatus;

  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  product: Product;
  product_id: string;
  order_id: string;
};

export type Profile = {
  id: string;
  group?: string;
  avatar_url: string;
  email: string;
  full_name: string;
  phone: string;
};

