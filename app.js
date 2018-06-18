// Storage Controller
const StorageCtrl = (function StorageCtrl() {})();

// Item Controller
const ItemCtrl = (function ItemCtrl() {})();

// UI Controller
const UICtrl = (function UICtrl() {})();

// APP Controller
const App = (function App(StorageCtrl, ItemCtrl, UICtrl) {})(
  StorageCtrl,
  ItemCtrl,
  UICtrl
);
