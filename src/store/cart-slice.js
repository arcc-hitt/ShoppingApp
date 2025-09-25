import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, set, get } from 'firebase/database';
import { database } from '../firebase';
import { uiActions } from './ui-slice';

export const sendCartData = createAsyncThunk(
  'cart/sendCartData',
  async (_, { dispatch, getState }) => {
    const cartData = getState().cart;
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      })
    );

    try {
      await set(ref(database, 'cart'), cartData);
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!',
        })
      );
      setTimeout(() => {
        dispatch(uiActions.hideNotification());
      }, 3000);
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!',
        })
      );
      setTimeout(() => {
        dispatch(uiActions.hideNotification());
      }, 3000);
    }
  }
);

export const fetchCartData = createAsyncThunk(
  'cart/fetchCartData',
  async (_, { dispatch }) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Fetching...',
        message: 'Fetching cart data!',
      })
    );

    try {
      const snapshot = await get(ref(database, 'cart'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        dispatch(cartActions.replaceCart(data));
      }
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Fetched cart data successfully!',
        })
      );
      setTimeout(() => {
        dispatch(uiActions.hideNotification());
      }, 3000);
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Fetching cart data failed!',
        })
      );
      setTimeout(() => {
        dispatch(uiActions.hideNotification());
      }, 3000);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    isVisible: false,
  },
  reducers: {
    replaceCart(state, action) {
      state.items = action.payload.items || [];
      state.totalQuantity = action.payload.totalQuantity || 0;
    },
    toggle(state) {
      state.isVisible = !state.isVisible;
    },
    addItem(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          title: newItem.title,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
    },
    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }
    },
    increaseItem(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      existingItem.quantity++;
      existingItem.totalPrice += existingItem.price;
      state.totalQuantity++;
    },
    decreaseItem(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }
      state.totalQuantity--;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;