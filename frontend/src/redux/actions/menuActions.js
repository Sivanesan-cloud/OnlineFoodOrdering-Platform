import API from "../../utils/api";

import {
  getMenusRequest,
  getMenusSuccess,
  getMenusFail,
  createMenuRequest,
  createMenuSuccess,
  createMenuFail,
  addItemRequest,
  addItemSuccess,
  addItemFail,
} from "../slices/menuSlice";

const getMenuCategories = (data) => {
  if (Array.isArray(data?.data) && data.data.length > 0) {
    return {
      menu: data.data[0].menu || [],
      menuId: data.data[0]._id,
    };
  }

  return {
    menu: data?.menu || [],
    menuId: data?.menuId || null,
  };
};

export const getMenus = (id) => async (dispatch) => {
  try {
    dispatch(getMenusRequest());

    const { data } = await API.get(`/v1/eats/stores/${id}/menus`);

    dispatch(getMenusSuccess(getMenuCategories(data)));
  } catch (error) {
    dispatch(getMenusFail(error.response?.data?.message || error.message));
  }
};

export const createMenu =
  ({ restaurantId, category }) =>
  async (dispatch) => {
    try {
      dispatch(createMenuRequest());

      const body = {
        restaurant: restaurantId,
        menu: [{ category, items: [] }],
      };

      const { data } = await API.post(
        `/v1/eats/stores/${restaurantId}/menus`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(createMenuSuccess(data.data));
    } catch (error) {
      dispatch(createMenuFail(error.response?.data?.message || error.message));
    }
  };

export const addItemToMenu =
  ({ menuId, category, foodItemId, restaurantId }) =>
  async (dispatch) => {
    try {
      dispatch(addItemRequest());

      const body = {
        category,
        foodItemId,
      };

      const { data } = await API.patch(
        `/v1/eats/stores/${restaurantId}/menus/${menuId}/addItem`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(addItemSuccess(data.data));
    } catch (error) {
      dispatch(addItemFail(error.response?.data?.message || error.message));
    }
  };
