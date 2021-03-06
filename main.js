const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    return `<li class="book-item" role="article">
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

  createLoader({ element }) {
    const previousHtml = element.innerHTML;

    return {
      showLoader() {
        element.innerHTML = `<div class="loading"></div>`;
      },
      hideLoader() {
        element.innerHTML = previousHtml;
      },
    };
  }

  showToast({ text, color, hideAfter = 3000 }) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add(color);
    toast.innerHTML = `<span>${text}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(async () => {
      toast.classList.add("hide");
      await sleep(1000);
      toast.remove();
    }, hideAfter);
  }
}

const uiController = new UiController({
  searchInput: "[data-search-input]",
  booksList: "[data-books-list]",
  searchIcon: "[data-search-icon]",
  form: "[data-search-books-form]",
  toastContainer: "[data-toast-container]",
});

const searchButtonLoader = uiController.createLoader({
  element: uiController.searchIcon,
});

const searchHandler = async (event) => {
  event.preventDefault();
  const q = uiController.searchInput.value;

  if (!q) return;

  try {
    searchButtonLoader.showLoader();
    const { items: books } = await googleBooksController.requestBooks({
      q,
    });
    searchButtonLoader.hideLoader();
    uiController.renderBooks(books);
  } catch (e) {
    searchButtonLoader.hideLoader();
    uiController.showToast({
      text: "Something went wrong",
      color: "danger",
    });
    console.error({ e });
  }
};

uiController.form.addEventListener("submit", searchHandler);
