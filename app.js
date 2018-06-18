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
const UICtrl = (function UICtrl() {})();

// APP Controller
const App = (function App(StorageCtrl, ItemCtrl, UICtrl) {
  return {
    init() {
      const items = ItemCtrl.getItems();
      const totalCalories = ItemCtrl.getTotalCalories();
      console.log(items);
      console.log(totalCalories);
    }
  };
})(StorageCtrl, ItemCtrl, UICtrl);

App.init();
