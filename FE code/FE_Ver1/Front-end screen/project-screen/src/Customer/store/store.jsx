import { configureStore, createSlice } from '@reduxjs/toolkit';

// Tạo slice cho sản phẩm
const productSlice = createSlice({
  name: 'product',
  initialState: {
    selectedProduct: null,
    productToExchange: null,
    user: null,
    sellerInfo: null,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      console.log('Setting selected product:', action.payload);
      state.selectedProduct = action.payload;
    },
    setUser: (state, action) => {
      console.log('Setting user:', action.payload);
      state.user = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setProductToExchange: (state, action) => {
      console.log('Setting product to exchange:', action.payload); // Thêm log để kiểm tra
      state.productToExchange = action.payload;
    },
    // setSellerInfo: (state, action) => {
    //   console.log('Setting seller info:', action.payload); // Thêm log để kiểm tra
    //   state.sellerInfo = action.payload;
    // },
  },
});

export const { setSelectedProduct, setProductToExchange, clearSelectedProduct, setUser, setSellerInfo } = productSlice.actions;

const store = configureStore({
  reducer: {
    product: productSlice.reducer,
  },
});

export default store;
