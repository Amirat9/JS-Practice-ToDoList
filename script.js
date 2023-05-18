// Global DOM variables
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');

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

// Add the new item from the input to the list
function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
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
}

// Remove an item from the list
function removeItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      e.target.parentElement.parentElement.remove()
    }
  }
}

// Clear all items from the list
function clearAll(e) { 
  if(e.target.classList.contains('btn-clear')) {
    if(confirm('Are you sure?')) {
      const itemsArray = Array.from(itemList.children);
      itemsArray.forEach(item => item.remove());
    }
  }
}

// Event Listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clearButton.addEventListener('click', clearAll);
