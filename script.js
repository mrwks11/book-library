// BOOK CLASS
class Book {
  constructor(title, author, pages, isbn, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isbn = isbn;
    this.read = read;
  }
}

// UI CLASS
class UI {
  static displayLibrary() {
    const myLibrary = Store.getMyLibrary();

    myLibrary.forEach((book) => UI.addBookToLibrary(book));
  }

  // Create elements and add book to UI (my library)
  static addBookToLibrary(book) {
    const library = document.querySelector('#library');

    const row = document.createElement('tr');
    row.dataset.isbn = book.isbn;

    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.isbn}</td>
            <td><button class="btn read-btn">${book.read}</button></td>
            <td><button class="btn remove-btn" data-isbn="${book.isbn}">Remove</button></td>
        `;

    library.appendChild(row);
  }

  // Show error or success message
  static alertMessage(message, className) {
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    const div = document.createElement('div');
    div.textContent = message;
    div.classList.add(className);

    if (className === 'error') {
      container.insertBefore(div, form);
      setTimeout(() => {
        div.remove();
      }, 2000);
    } else {
      container.insertBefore(div, form);
      setTimeout(() => {
        div.remove();
      }, 2000);
    }
  }

  // Check read status
  static checkReadStatus(read) {
    return read.checked ? 'yes' : 'no';
  }

  // Change read status in UI
  static changeReadStatus(target) {
    if (target.classList.contains('read-btn')) {
      target.textContent === 'yes'
        ? (target.textContent = 'no')
        : (target.textContent = 'yes');
      // Success message
      UI.alertMessage('Read status changed', 'success');
    } else {
      return;
    }
  }

  // Remove book from UI
  static removeBook(target) {
    if (target.classList.contains('remove-btn')) {
      target.parentElement.parentElement.remove();
      // Success message
      UI.alertMessage('Book removed', 'success');
    } else {
      return;
    }
  }
}

// STORE LIBRARY CLASS (local storage can't store arrays, only strings)
class Store {
  static getMyLibrary() {
    let myLibrary;
    if (localStorage.getItem('myLibrary') === null) {
      myLibrary = [];
    } else {
      // Convert string to array
      myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    }

    return myLibrary;
  }

  static addBook(book) {
    const myLibrary = Store.getMyLibrary();
    myLibrary.push(book);
    // Convert array to string
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  }

  static removeBook(isbn) {
    // Remove by ISBN because it's unique
    const myLibrary = Store.getMyLibrary();
    // Loop through myLibrary and remove book with ISBN-match
    myLibrary.forEach((book, index) => {
      if (book.isbn === isbn) {
        myLibrary.splice(index, 1);
      }
    });
    // Convert array to string
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  }
}

// Event: display myLibrary
document.addEventListener('DOMContentLoaded', UI.displayLibrary());

// Event: add a book
const form = document.querySelector('#book-form');
form.addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const pages = document.querySelector('#pages').value;
  const isbn = document.querySelector('#isbn').value;
  let read = document.querySelector('#read');

  // Check radio button value
  read = UI.checkReadStatus(read);

  // Check if field is empty
  if (title === '' || author === '' || pages === '' || isbn === '') {
    // Initiate error message
    UI.alertMessage('Please fill in all fields', 'error');
  } else {
    // Initiate success message
    UI.alertMessage('Book added', 'success');

    // Create new book with form input
    let book = new Book(title, author, pages, isbn, read);

    // Add book to UI (my library)
    UI.addBookToLibrary(book);

    // Add book to local storage
    Store.addBook(book);

    // Clear UI form fields
    form.reset();
  }
});

// Event: change read status & remove a book
const library = document.querySelector('#library');
library.addEventListener('click', (e) => {
  // Change read status UI
  UI.changeReadStatus(e.target);

  // Remove from UI
  UI.removeBook(e.target);

  // Remove from local storage
  Store.removeBook(e.target.dataset.isbn);
});
