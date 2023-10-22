import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProduct = (id: string) => { 
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertProduct = () => { 
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data:any) {
      const { data: product, error } = await supabase
        .from('products')
        .insert(data)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return product;
    },  
      
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return product;
    },
      
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: string) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}