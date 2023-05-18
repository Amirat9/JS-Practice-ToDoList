// Global DOM variables
const itemForm = document.getElementById('item-form');
const formBtn = itemForm.querySelector('.btn');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
let isEditeMode = false;


// Utility Functions
// Create a new Icon element for the button
function createIcon() {
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-xmark';
  return icon;
}

// Create a new Button element
function createButton(icon) {
  const button = document.createElement('button');
  button.className = 'remove-item btn-link text-red';
  button.appendChild(icon);
  return button;
}

// Create a new li element for the list
function createItemElement(newItem, button) {
  const newItemElement = document.createElement('li');
  const textNode = document.createTextNode(newItem);
  newItemElement.appendChild(textNode);
  newItemElement.appendChild(button);
  return newItemElement;
}

// Pervent duplicate items
function isDuplicateItem(newItem) { 
  const items = Array.from(itemList.children);
  let isDuplicate = false;
  items.forEach((item) => { 
    if (item.firstChild.textContent.toLowerCase() === newItem.toLowerCase()) {
      isDuplicate = true;
    }
  });
  return isDuplicate;
}

// Add the new item from the input to the list
function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (isDuplicateItem(newItem)) { 
    alert('This item already exists');
    return;
  }

  // Edit mode
  if (isEditeMode) { 
    const items = Array.from(itemList.children);
    items.forEach((item) => { 
      if (item.classList.contains('edit-mode')) {
        changeItemInLocalStorage(item.firstChild.textContent, newItem);
        item.firstChild.textContent = newItem;
        item.classList.remove('edit-mode');
        formBtn.style.backgroundColor = '#333';
        formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
        itemInput.value = '';
        isEditeMode = false;
      }
    });
    return;
  }

  
  // Create the icon
  const icon = createIcon();

  // Creating a button
  const button = createButton(icon);

  // Create an li element
  const newItemElement = createItemElement(newItem, button);

  // Adding the item
  itemList.appendChild(newItemElement);

  // return the filter and clear-all button after adding an item
  clearUI();

  itemInput.value = '';

  // Add item to local storage
  addItemToLocalStorage(newItem);
}

// Set an item to edit mode
function setItemToEditMode(item) {
  isEditeMode = true;
  const items = Array.from(itemList);
  items.forEach((i) => { 
    i.classList.remove('edit-mode'); 
  });

  item.classList.add('edit-mode');
  formBtn.style.backgroundColor = '#228B22';
  formBtn.textContent = 'Edit Item';
  itemInput.value = item.firstChild.textContent;
}

// Remove an item from the list
function removeItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      removeItemFromLocalStorage(e.target.parentElement.parentElement.firstChild.textContent);
      e.target.parentElement.parentElement.remove()

      // Clear UI in case of no items
      clearUI();
    }
  } else if(e.target.tagName === 'LI') {
    if(isEditeMode) {
      isEditeMode = false;
      e.target.classList.remove('edit-mode');
      formBtn.style.backgroundColor = '#0000FF';
      itemInput.value = '';
    } else {
      setItemToEditMode(e.target);
    }
  }
}

// Clear all items from the list
function clearAll(e) { 
  if(e.target.classList.contains('btn-clear')) {
    if(confirm('Are you sure?')) {
      const itemsArray = Array.from(itemList.children);
      itemsArray.forEach(item => item.remove());
      localStorage.clear();
      clearUI();
    }
  }
}

// Clear UI in case of no items
function clearUI() {
  const items = itemList.querySelectorAll('li');
  if(items.length > 0) {
    document.querySelector('.filter').style.display = 'block'
    document.querySelector('.btn-clear').style.display = 'block'
  } else {
    document.querySelector('.filter').style.display = 'none'
    document.querySelector('.btn-clear').style.display = 'none'
  }
}

// Filter items
function filterItems(e) { 
  e.preventDefault();
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');
  items.forEach(item => { 
    const itemName = item.firstChild.textContent.toLowerCase();
    if (text === '' || itemName.includes(text)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Add item to DOM
function addItemToDOM(item) {
  // Create the icon
  const icon = createIcon();

  // Creating a button
  const button = createButton(icon);

  // Create an li element
  const newItemElement = createItemElement(item, button);

  // Adding the item
  itemList.appendChild(newItemElement);

  // return the filter and clear-all button after adding an item
  clearUI();
}

// Add item to local storage
function addItemToLocalStorage(item) {
  let itemsFromLocalStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromLocalStorage = [];
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));
  }

  itemsFromLocalStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
}

// Get items from local storage
function getItemsFromLocalStorage() { 
  let itemsFromLocalStorage;
  if (localStorage.getItem('items') === null) { 
    return;
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));
  }
  itemsFromLocalStorage.forEach(item => addItemToDOM(item));
}

// change an item in local storage
function changeItemInLocalStorage(item, newItem) { 
  let itemsFromLocalStorage;
  if (localStorage.getItem('items') === null) { 
    return;
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));
  }

  itemsFromLocalStorage.forEach((itemFromLocalStorage, index) => { 
    if (item === itemFromLocalStorage) {
      itemsFromLocalStorage[index] = newItem;
      localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
    }
  });
}

// Remove item from local storage
function removeItemFromLocalStorage(item) { 
  let itemsFromLocalStorage;
  if (localStorage.getItem('items') === null) { 
    return;
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));
  }

  itemsFromLocalStorage.forEach((itemFromLocalStorage, index) => { 
    if (item === itemFromLocalStorage) {
      itemsFromLocalStorage.splice(index,1);
      localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
    }
  });
}

// Event Listeners
window.addEventListener('DOMContentLoaded', getItemsFromLocalStorage);
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', removeItem);
clearButton.addEventListener('click', clearAll);
itemFilter.addEventListener('input', filterItems);


clearUI();