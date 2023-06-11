// Retrieve the form and the list where game events will be displayed
const gameForm = document.getElementById('gameForm');
const gameList = document.getElementById('gameList');

// Handle form submission for game events
gameForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Retrieve the values from the form
  const gameName = document.getElementById('gameName').value;
  const gameDate = document.getElementById('gameDate').value;
  const gameLink = document.getElementById('gameLink').value;

  // Create a new list item for the game event
  const listItem = document.createElement('li');

  // Create a link element for the game event
  const gameLinkElement = document.createElement('a');
  gameLinkElement.href = gameLink;
  gameLinkElement.target = '_blank';
  gameLinkElement.textContent = gameName;

  // Create a span element for the game date
  const gameDateElement = document.createElement('span');
  gameDateElement.textContent = gameDate;

  // Append the game name and date to the list item
  listItem.appendChild(gameLinkElement);
  listItem.appendChild(document.createTextNode(' - '));
  listItem.appendChild(gameDateElement);

  // Append the list item to the game list
  gameList.appendChild(listItem);

  // Reset the form fields
  gameForm.reset();
});

// Retrieve the form for equipment suggestions
const equipmentForm = document.getElementById('equipmentForm');

// Handle form submission for equipment suggestions
equipmentForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Retrieve the values from the form
  const equipmentName = document.getElementById('equipmentName').value;
  const equipmentCompany = document.getElementById('equipmentCompany').value;
  const equipmentLink = document.getElementById('equipmentLink').value;

  // Create a paragraph element for the equipment suggestion
  const suggestionParagraph = document.createElement('p');
  suggestionParagraph.textContent = `For ${equipmentName}, we recommend ${equipmentCompany}.`;

  // Create a link element for the company link
  const companyLinkElement = document.createElement('a');
  companyLinkElement.href = equipmentLink;
  companyLinkElement.target = '_blank';
  companyLinkElement.textContent = 'Learn more';

  // Append the company link to the suggestion paragraph
  suggestionParagraph.appendChild(document.createTextNode(' '));
  suggestionParagraph.appendChild(companyLinkElement);

  // Append the suggestion paragraph to the equipment section
  const equipmentSection = document.querySelector('section:nth-of-type(2)');
  equipmentSection.appendChild(suggestionParagraph);

  // Reset the form fields
  equipmentForm.reset();
});
