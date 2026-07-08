import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menus: [], // Must remain an array for .map() to work
  menuId: null,

  loading: false,
  error: null,

  creating: false,
  createError: null,

  addingItem: false,
  addError: null,
};

const menuSlice = createSlice({
  name: "menus",
  initialState,

  reducers: {
    // GET MENUS
    getMenusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    getMenusSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      
      // ✅ FIX: Fallback sequence checks for common API wrapper array patterns
      state.menus = 
        action.payload.menus ||   // check if key is plural (e.g., { menus: [...] })
        action.payload.menu ||    // check your current key (e.g., { menu: [...] })
        (Array.isArray(action.payload) ? action.payload : []); // fallback if direct array or default to empty
        
      state.menuId = action.payload.menuId || null;
    },

    getMenusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CREATE MENU
    createMenuRequest: (state) => {
      state.creating = true;
    },

    createMenuSuccess: (state, action) => {
      state.creating = false;
      state.newMenu = action.payload;
    },

    createMenuFail: (state, action) => {
      state.creating = false;
      state.createError = action.payload;
    },

    // ADD ITEM
    addItemRequest: (state) => {
      state.addingItem = true;
    },

    addItemSuccess: (state, action) => {
      state.addingItem = false;
      state.updatedMenu = action.payload;
    },

    addItemFail: (state, action) => {
      state.addingItem = false;
      state.addError = action.payload;
    },

    clearMenuErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.addError = null;
    },
  },
});

export const {
  getMenusRequest,
  getMenusSuccess,
  getMenusFail,

  createMenuRequest,
  createMenuSuccess,
  createMenuFail,

  addItemRequest, 
  addItemSuccess,
  addItemFail,

  clearMenuErrors,
} = menuSlice.actions;

export default menuSlice.reducer;
