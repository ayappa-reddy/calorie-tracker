// Storage Controller
const StorageCtrl = (function StorageCtrl() {})();

// Item Controller
const ItemCtrl = (function ItemCtrl() {
  // State for the whole application
  const data = {
    items: [],
    currentItemToEdit: null,
    totalCalories: 0
  };

  // Generate ID's for the new items to be added
  const generateID = function generateID() {
    let id = 0;

    if (data.items.length) {
      id = data.items[data.items.length - 1].id + 1;
    }

    return id;
  };

  // Public Methods
  return {
    // Return all the items in data
    getItems() {
      return data.items;
    },

    // Calculate and return the total calories
    getTotalCalories() {
      let totalCalories = 0;

      data.items.forEach(item => {
        totalCalories += parseInt(item.calories);
      });

      data.totalCalories = totalCalories;

      return data.totalCalories;
    },

    // Add new items to the data
    addItem(name, calories) {
      const item = { id: generateID(), name, calories };
      data.items.push(item);
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
    totalCaloriesEl: ".heading-primary__total-calories",
    mealInputEl: ".form__input--meal",
    caloriesInputEl: ".form__input--calories",
    addBtn: ".btn--add"
  };

  return {
    UISelectors,

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

    displayTotalCalories() {
      let totalCalories = ItemCtrl.getTotalCalories();
      document.querySelector(
        UISelectors.totalCaloriesEl
      ).textContent = totalCalories;
    },

    getInputVals() {
      const { mealInputEl, caloriesInputEl } = UISelectors;

      let name = document.querySelector(mealInputEl).value;
      let calories = document.querySelector(caloriesInputEl).value;

      return {
        name,
        calories
      };
    }
  };
})();

// APP Controller
const App = (function App(StorageCtrl, ItemCtrl, UICtrl) {
  const items = ItemCtrl.getItems();

  const addMealItem = function addMealItem(e) {
    const { name, calories } = UICtrl.getInputVals();

    if (name && calories) {
      ItemCtrl.addItem(name, calories);
      UICtrl.displayItems(items);
      UICtrl.displayTotalCalories();
    }

    e.preventDefault();
  };

  // Event Listeners
  const loadAllEventListeners = function loadAllEventListeners() {
    document
      .querySelector(UICtrl.UISelectors.addBtn)
      .addEventListener("click", addMealItem);
  };

  return {
    init() {
      UICtrl.displayItems(items);
      UICtrl.displayTotalCalories();

      loadAllEventListeners();
    }
  };
})(StorageCtrl, ItemCtrl, UICtrl);

App.init();
