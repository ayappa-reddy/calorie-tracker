// Storage Controller
const StorageCtrl = (function StorageCtrl() {})();

// Item Controller
const ItemCtrl = (function ItemCtrl() {
  const data = {
    items: [
      { id: 0, name: "Chicken", calories: 500 },
      { id: 1, name: "Steak", calories: 800 },
      { id: 2, name: "Eggs", calories: 300 }
    ],
    currentItemToEdit: null,
    totalCalories: 0
  };

  return {
    getItems() {
      return data.items;
    },

    getTotalCalories() {
      let totalCalories = 0;

      data.items.forEach(item => {
        totalCalories += item.calories;
      });

      data.totalCalories = totalCalories;

      return data.totalCalories;
    },

    logData() {
      console.log(data);
    }
  };
})();

// UI Controller
const UICtrl = (function UICtrl() {
  UISelectors = {
    itemListEl: ".item-list",
    totalCaloriesEl: ".heading-primary__total-calories"
  };

  return {
    displayItems(items) {
      let html = "";

      items.forEach(item => {
        html += `
        <li class="item-list__item">
          <strong class="item-list__meal">${item.name}:
          </strong>
          <em class="item-list__calories">${item.calories} Calories</em>
          <span class="item-list__edit-item">E</span>
        </li>
        `;
      });

      document.querySelector(UISelectors.itemListEl).innerHTML = html;
    },

    displayTotalCalories(totalCalories) {
      document.querySelector(
        UISelectors.totalCaloriesEl
      ).innerHTML = totalCalories;
    }
  };
})();

// APP Controller
const App = (function App(StorageCtrl, ItemCtrl, UICtrl) {
  const items = ItemCtrl.getItems();

  const totalCalories = ItemCtrl.getTotalCalories();
  return {
    init() {
      UICtrl.displayItems(items);
      UICtrl.displayTotalCalories(totalCalories);
      console.log(totalCalories);
    }
  };
})(StorageCtrl, ItemCtrl, UICtrl);

App.init();
