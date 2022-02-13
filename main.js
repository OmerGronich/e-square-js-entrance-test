const googleBooksController = {
  get baseUrl() {
    return new URL("https://www.googleapis.com/books/v1/volumes");
  },
  async requestBooks(params) {
    const url = this.baseUrl;

    for (const param in params) {
      url.searchParams.append(param, params[param]);
    }

    return (await fetch(url)).json();
  },
};

class UiController {
  qs = document.querySelector.bind(window.document);

  constructor(elements) {
    Object.entries(elements).forEach(([prop, selector]) => {
      this[prop] = this.qs(selector);
    });
  }

  renderBooks(books) {
    this.booksList.innerHTML = books.reduce(
      (acc, book) => acc + this.renderBook(book),
      ""
    );
  }

  renderBook(book) {
    return `<li class="book-item">
        <div class="book-item__image">
          <img src="${book.volumeInfo?.imageLinks?.thumbnail}" alt="${
      book?.volumeInfo?.title || ""
    }">
        </div>
        <div class="book-item__info">
            <h2 class="book-item__title">${
              book?.volumeInfo?.title ||
              this.getPlaceholderText("This book is missing a title")
            }</h2>
            <p class="book-item__description">${
              book?.volumeInfo?.description ||
              this.getPlaceholderText("This book is missing a description")
            }
        </div>
      </li>`;
  }

  getPlaceholderText(text) {
    return `<span class="book-item__placeholder-text">${text}</span>`;
  }

  showLoader() {
    uiController.searchIcon.innerHTML = `<div class="loading"></div>`;
  }

  hideLoader() {
    uiController.searchIcon.innerHTML = `&#128269;`;
  }
}

const uiController = new UiController({
  searchInput: "[data-search-input]",
  booksList: "[data-books-list]",
  searchIcon: "[data-search-icon]",
  form: "[data-search-books-form]",
});

const searchHandler = async (event) => {
  event.preventDefault();
  const q = uiController.searchInput.value;

  if (!q) return;

  try {
    uiController.showLoader();
    const { items: books } = await googleBooksController.requestBooks({
      q,
    });
    uiController.hideLoader();
    uiController.renderBooks(books);
  } catch (e) {
    console.error({ e });
  }
};

uiController.form.addEventListener("submit", searchHandler);
