// Storage Controller
const StorageCtrl = (function StorageCtrl() {
  return {
    getItemsFromStorage() {
      let items = null;

      if (!localStorage.getItem("items")) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },

    setItemsInStorage(item) {
      let items = null;

      if (!localStorage.getItem("items")) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      items.push(item);

      localStorage.setItem("items", JSON.stringify(items));
    },

    updateItemsInStorage(id, name, calories) {
      const items = JSON.parse(localStorage.getItem("items"));

      const updatedItem = { id, name, calories };

      items.forEach((item, index) => {
        if (item.id === id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    }
  };
})();

// Item Controller
const ItemCtrl = (function ItemCtrl() {
  // State for the whole application
  const data = {
    items: [...StorageCtrl.getItemsFromStorage()],
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

    getItemWithID(id) {
      return data.items.filter(item => item.id === id)[0];
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
      const id = generateID();
      const item = { id, name, calories };
      StorageCtrl.setItemsInStorage(item);
      data.items.push(item);
    },

    setCurrentItemToEdit(id) {
      const item = this.getItemWithID(id);
      data.currentItemToEdit = item;
    },

    updateCurrentItem(name, calories) {
      const item = data.currentItemToEdit;
      item.name = name;
      item.calories = calories;
      StorageCtrl.updateItemsInStorage(item.id, name, calories);
    },

    deleteItem() {
      const remainingItems = data.items.filter(
        item => item.id !== data.currentItemToEdit.id
      );
      data.currentItemToEdit = null;
      data.items = remainingItems;
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
    addBtn: ".btn--add",
    updateBtn: ".btn--update",
    deleteBtn: ".btn--delete",
    backBtn: ".btn--back"
  };

  return {
    UISelectors,

    displayItems(items) {
      let html = "";

      items.forEach(item => {
        html += `
        <li class="item-list__item item-list__item--${item.id}">
          <strong class="item-list__meal">${item.name}:
          </strong>
          <em class="item-list__calories">${item.calories} Calories</em>
          <span class="item-list__edit-icon">E</span>
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
    },

    hideEditBtns() {
      document.querySelector(UISelectors.addBtn).style.display = "inline-block";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
    },

    showEditBtns() {
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display =
        "inline-block";
      document.querySelector(UISelectors.deleteBtn).style.display =
        "inline-block";
      document.querySelector(UISelectors.backBtn).style.display =
        "inline-block";
    },

    clearInputs() {
      const { mealInputEl, caloriesInputEl } = UISelectors;

      document.querySelector(mealInputEl).value = "";
      document.querySelector(caloriesInputEl).value = "";
    },

    fillInputsWithItemValues(id) {
      const item = ItemCtrl.getItemWithID(id);
      document.querySelector(this.UISelectors.mealInputEl).value = item.name;
      document.querySelector(this.UISelectors.caloriesInputEl).value =
        item.calories;
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
      UICtrl.clearInputs();
      UICtrl.displayItems(items);
      UICtrl.displayTotalCalories();
    }

    e.preventDefault();
  };

  const editMealItem = function editMealItem(e) {
    if (e.target.classList.contains("item-list__edit-icon")) {
      const className = e.target.parentElement.className;

      // Regex to pull out the id from the className
      let re = /[^\d+]/g;

      let id = parseInt(className.replace(re, ""));

      UICtrl.showEditBtns();

      // Fill input fields with name and calories for the clicked item
      UICtrl.fillInputsWithItemValues(id);

      // Set the item with this id to be the current item for editing
      ItemCtrl.setCurrentItemToEdit(id);
    }

    e.preventDefault();
  };

  const updateMealItem = function updateMealItem(e) {
    const { name, calories } = UICtrl.getInputVals();

    if (name && calories) {
      // update the currentItem with input values
      ItemCtrl.updateCurrentItem(name, calories);
      UICtrl.clearInputs();
      UICtrl.hideEditBtns();
      UICtrl.displayItems(items);
      UICtrl.displayTotalCalories();
    }

    e.preventDefault();
  };

  const deleteMealItem = function deleteMealItem(e) {
    ItemCtrl.deleteItem();
    UICtrl.clearInputs();
    UICtrl.hideEditBtns();
    UICtrl.displayItems(ItemCtrl.getItems());
    UICtrl.displayTotalCalories();
    e.preventDefault();
  };

  const backBtnHandler = function backBtnHandler(e) {
    UICtrl.hideEditBtns();
    UICtrl.clearInputs();
    e.preventDefault();
  };

  // Prevent default Enter keypress from submitting the form
  const preventEnterKeyPress = function preventEnterKeyPress(e) {
    if (e.keycode === 13 || e.which === 13) {
      e.preventDefault();
      return false;
    }
  };

  // Event Listeners
  const loadAllEventListeners = function loadAllEventListeners() {
    document
      .querySelector(UICtrl.UISelectors.addBtn)
      .addEventListener("click", addMealItem);
    document
      .querySelector(UICtrl.UISelectors.updateBtn)
      .addEventListener("click", updateMealItem);
    document
      .querySelector(UICtrl.UISelectors.deleteBtn)
      .addEventListener("click", deleteMealItem);
    document
      .querySelector(UICtrl.UISelectors.backBtn)
      .addEventListener("click", backBtnHandler);
    document
      .querySelector(".item-list")
      .addEventListener("click", editMealItem);
    document.addEventListener("keypress", preventEnterKeyPress);
  };

  return {
    init() {
      UICtrl.hideEditBtns();
      UICtrl.displayItems(items);
      UICtrl.displayTotalCalories();

      loadAllEventListeners();
    }
  };
})(StorageCtrl, ItemCtrl, UICtrl);

App.init();
