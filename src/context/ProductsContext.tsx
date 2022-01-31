import React, { createContext, useEffect, useState } from 'react';
import { ImagePickerResponse } from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import { Producto, ProductsResponse } from '../interfaces/appInterfaces.interface';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProductById: (id: string) => Promise<Producto>;
  uploadImage: (data: any, id: string) => Promise<void>; // TODO: cambiar ANY
}



export const ProductsContext = createContext({} as ProductsContextProps);



export const ProductsProvider = ({ children }: any) => {

  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);


  const loadProducts = async () => {
    const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
    setProducts([...resp.data.productos]);
  }

  const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {
    const { data } = await cafeApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId
    });
    setProducts([...products, data]);
    return data
  }

  const updateProduct = async (categoryId: string, productName: string, productId: string) => {
    const { data } = await cafeApi.put<Producto>(`/productos/${productId}`, {
      nombre: productName,
      categoria: categoryId
    });
    setProducts(products.map(product => product._id === productId ? data : product))
  }

  const deleteProduct = async (id: string) => {

  }

  const loadProductById = async (id: string): Promise<Producto> => {
    const { data } = await cafeApi.get<Producto>(`/productos/${id}`);
    return data;
  };

  const uploadImage = async (data: ImagePickerResponse, id: string) => {
    const fileToUpload = {
      uri: data.assets![0].uri,
      type: data.assets![0].type,
      name: data.assets![0].fileName,
    }

    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    try {
      const resp = cafeApi.put(`/uploads/productos/${id}`, formData)
      console.log(resp);
    } catch (error) {
      console.log({error});
    }

  }

  return (
    <ProductsContext.Provider value={{
      products,
      loadProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      loadProductById,
      uploadImage,
    }}>
      {children}
    </ProductsContext.Provider>
  )
}