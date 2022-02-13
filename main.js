const googleBooksController = {
  get baseUrl() {
    return new URL("https://www.googleapis.com/books/v1/volumes");
  },
  async requestBooks(params) {
    const url = this.baseUrl;

    for (param in params) {
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
    // TODO show user a message if something goes wrong
    console.error({ e });
  }
};

/*const books = [
  {
    kind: "books#volume",
    id: "lJB5DwAAQBAJ",
    etag: "jvSlXVWzyOY",
    selfLink: "https://www.googleapis.com/books/v1/volumes/lJB5DwAAQBAJ",
    volumeInfo: {
      title: "The Ultimate Harry Potter and Philosophy",
      subtitle: "Hogwarts for Muggles",
      authors: ["William Irwin", "Gregory Bassham"],
      publisher: "John Wiley & Sons",
      publishedDate: "2010-09-14",
      description:
        "A philosophical exploration of the entire seven-book Harry Potter series Harry Potter has been heralded as one of the most popular book series of all time and the philosophical nature of Harry, Hermione, and Ron's quest to rid the world of its ultimate evil is one of the many things that make this series special. The Ultimate Harry Potter and Philosophy covers all seven titles in J.K. Rowling's groundbreaking series and takes fans back to Godric's Hollow to discuss life after death, to consider what moral reasoning drove Harry to choose death, and to debate whether Sirius Black is a man or a dog. With publication timed to coincide with the release of the movie Harry Potter and the Deathly Hallows (Part 1), this book will be the definitive guide for all fans looking to appreciate the series on a deeper level. Covers a range of intriguing topics such as the redemption of Severus Snape, the power of love, and destiny in the wizarding world Gives you a new perspective on Harry Potter characters, plot lines, and themes Makes a perfect companion to the Harry Potter books and movies Packed with interesting ideas and insights, The Ultimate Harry Potter and Philosophy is an ideal companion for anyone interested in unraveling the subtext and exploring the greater issues at work in the story.",
      industryIdentifiers: [
        {
          type: "ISBN_13",
          identifier: "9780470398258",
        },
        {
          type: "ISBN_10",
          identifier: "0470398256",
        },
      ],
      readingModes: {
        text: false,
        image: true,
      },
      pageCount: 304,
      printType: "BOOK",
      categories: ["Philosophy"],
      averageRating: 4.5,
      ratingsCount: 5,
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "0.0.1.0.preview.1",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=lJB5DwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=lJB5DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=lJB5DwAAQBAJ&printsec=frontcover&dq=harry+potter&hl=&cd=1&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=lJB5DwAAQBAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/The_Ultimate_Harry_Potter_and_Philosophy.html?hl=&id=lJB5DwAAQBAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "PARTIAL",
      embeddable: true,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=lJB5DwAAQBAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "SAMPLE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "A philosophical exploration of the entire seven-book Harry Potter series Harry Potter has been heralded as one of the most popular book series of all time and the philosophical nature of Harry, Hermione, and Ron&#39;s quest to rid the world of ...",
    },
  },
  {
    kind: "books#volume",
    id: "L18VBQAAQBAJ",
    etag: "HQfbkgc61bs",
    selfLink: "https://www.googleapis.com/books/v1/volumes/L18VBQAAQBAJ",
    volumeInfo: {
      title: "The Psychology of Harry Potter",
      subtitle: "An Unauthorized Examination Of The Boy Who Lived",
      authors: ["Neil Mulholland"],
      publisher: "BenBella Books",
      publishedDate: "2007-04-10",
      description:
        "Harry Potter has provided a portal to the wizarding world for millions of readers, but an examination of Harry, his friends and his enemies will take us on yet another journey: through the psyche of the Muggle (and wizard!) mind. The twists and turns of the series, as well as the psychological depth and complexity of J. K. Rowling’s characters, have kept fans enthralled with and puzzling over the many mysteries that permeate Hogwarts and beyond: • Do the Harry Potter books encourage disobedience? • Why is everyone so fascinated by Professor Lupin? • What exactly will Harry and his friends do when they finally pass those N.E.W.T.s? • Do even wizards live by the ticking of the clock? • Is Harry destined to end up alone? And why did it take Ron and Hermione so long to get together? Now, in The Psychology of Harry Potter, leading psychologists delve into the ultimate Chamber of Secrets, analyzing human mind and motivation by examining the themes and characters that make the Harry Potter books the bestselling fantasy series of all time. Grab a spot on the nearest couch, and settle in for some fresh revelations about our favorite young wizard!",
      industryIdentifiers: [
        {
          type: "ISBN_13",
          identifier: "9781932100884",
        },
        {
          type: "ISBN_10",
          identifier: "1932100881",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 326,
      printType: "BOOK",
      categories: ["Literary Criticism"],
      averageRating: 3.5,
      ratingsCount: 6,
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "0.1.1.0.preview.0",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=L18VBQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=L18VBQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=L18VBQAAQBAJ&printsec=frontcover&dq=harry+potter&hl=&cd=2&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=L18VBQAAQBAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/The_Psychology_of_Harry_Potter.html?hl=&id=L18VBQAAQBAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "PARTIAL",
      embeddable: true,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=L18VBQAAQBAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "SAMPLE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "Now, in The Psychology of Harry Potter, leading psychologists delve into the ultimate Chamber of Secrets, analyzing human mind and motivation by examining the themes and characters that make the Harry Potter books the bestselling fantasy ...",
    },
  },
  {
    kind: "books#volume",
    id: "L2EQuwEACAAJ",
    etag: "rhQ3vC6SXjM",
    selfLink: "https://www.googleapis.com/books/v1/volumes/L2EQuwEACAAJ",
    volumeInfo: {
      title: "Harry Potter and the Half-Blood Prince",
      subtitle: "v.6",
      authors: ["J. K. Rowling"],
      publishedDate: "2005",
      description:
        "As Harry enters his sixth year at Hogwarts, a storm is brewing in the battle between good and evil, a battle that promises to have incredible consequences for the magic world.",
      industryIdentifiers: [
        {
          type: "ISBN_10",
          identifier: "0439784549",
        },
        {
          type: "ISBN_13",
          identifier: "9780439784542",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 672,
      printType: "BOOK",
      categories: ["England"],
      averageRating: 4.5,
      ratingsCount: 93,
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "preview-1.0.0",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=L2EQuwEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=L2EQuwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=L2EQuwEACAAJ&dq=harry+potter&hl=&cd=3&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=L2EQuwEACAAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/Harry_Potter_and_the_Half_Blood_Prince.html?hl=&id=L2EQuwEACAAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "NO_PAGES",
      embeddable: false,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=L2EQuwEACAAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "NONE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "As Harry enters his sixth year at Hogwarts, a storm is brewing in the battle between good and evil, a battle that promises to have incredible consequences for the magic world.",
    },
  },
  {
    kind: "books#volume",
    id: "BFnuwAEACAAJ",
    etag: "dxvs2VVlXmI",
    selfLink: "https://www.googleapis.com/books/v1/volumes/BFnuwAEACAAJ",
    volumeInfo: {
      title: "Harry Potter the Complete Series",
      authors: ["J. K. Rowling"],
      publisher: "Arthur a Levine",
      publishedDate: "2009-07",
      description:
        "Collects the complete series that relates the adventures of young Harry Potter, who attends Hogwarts School of Witchcraft and Wizardry, where he and others of his kind learn their craft.",
      industryIdentifiers: [
        {
          type: "ISBN_10",
          identifier: "0545162076",
        },
        {
          type: "ISBN_13",
          identifier: "9780545162074",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 7,
      printType: "BOOK",
      categories: ["Juvenile Fiction"],
      averageRating: 4.5,
      ratingsCount: 94,
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "preview-1.0.0",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=BFnuwAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=BFnuwAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=BFnuwAEACAAJ&dq=harry+potter&hl=&cd=4&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=BFnuwAEACAAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/Harry_Potter_the_Complete_Series.html?hl=&id=BFnuwAEACAAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "NO_PAGES",
      embeddable: false,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=BFnuwAEACAAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "NONE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "Collects the complete series that relates the adventures of young Harry Potter, who attends Hogwarts School of Witchcraft and Wizardry, where he and others of his kind learn their craft.",
    },
  },
  {
    kind: "books#volume",
    id: "Gz8t2MttEQUC",
    etag: "xJJIJ2iyNfs",
    selfLink: "https://www.googleapis.com/books/v1/volumes/Gz8t2MttEQUC",
    volumeInfo: {
      title: "Harry Potter and Philosophy",
      subtitle: "If Aristotle Ran Hogwarts",
      authors: ["David Baggett", "Shawn Klein", "William Irwin"],
      publisher: "Open Court Publishing",
      publishedDate: "2004",
      description:
        "Urging readers of the Harry Potter series to dig deeper than wizards, boggarts, and dementors, the authors of this unique guide collect the musings of seventeen philosophers on the series, who cover a wide range of Potter-related philosophical issues, including the difference between good and evil, the ethics of sorcery, and Aristotle's own school for wizards. Original.",
      industryIdentifiers: [
        {
          type: "ISBN_13",
          identifier: "9780812694550",
        },
        {
          type: "ISBN_10",
          identifier: "0812694554",
        },
      ],
      readingModes: {
        text: true,
        image: true,
      },
      pageCount: 243,
      printType: "BOOK",
      categories: ["Fiction"],
      averageRating: 3.5,
      ratingsCount: 10,
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "1.3.4.0.preview.3",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=Gz8t2MttEQUC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=Gz8t2MttEQUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=Gz8t2MttEQUC&printsec=frontcover&dq=harry+potter&hl=&cd=5&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=Gz8t2MttEQUC&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/Harry_Potter_and_Philosophy.html?hl=&id=Gz8t2MttEQUC",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "PARTIAL",
      embeddable: true,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: true,
        acsTokenLink:
          "http://books.google.com/books/download/Harry_Potter_and_Philosophy-sample-epub.acsm?id=Gz8t2MttEQUC&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api",
      },
      pdf: {
        isAvailable: true,
        acsTokenLink:
          "http://books.google.com/books/download/Harry_Potter_and_Philosophy-sample-pdf.acsm?id=Gz8t2MttEQUC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api",
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=Gz8t2MttEQUC&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "SAMPLE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "All the pages of this book are acid-free and have been individually bewitched with an anti-befuddlement incantation. Don&#39;t forget to keep your wand primed and read between the lines.",
    },
  },
  {
    kind: "books#volume",
    id: "HksgDQAAQBAJ",
    etag: "LTUJcUD1Z58",
    selfLink: "https://www.googleapis.com/books/v1/volumes/HksgDQAAQBAJ",
    volumeInfo: {
      title: "Harry Potter and the Philosopher's Stone",
      authors: ["J. K. Rowling"],
      publisher: "Bloomsbury Publishing",
      publishedDate: "2014-01-09",
      description:
        "Celebrate 20 years of Harry Potter magic! Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin!These new editions of the classic and internationally bestselling, multi-award-winning series feature instantly pick-up-able new jackets by Jonny Duddle, with huge child appeal, to bring Harry Potter to the next generation of readers. It's time to PASS THE MAGIC ON ...",
      industryIdentifiers: [
        {
          type: "ISBN_13",
          identifier: "9781408855898",
        },
        {
          type: "ISBN_10",
          identifier: "1408855895",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 352,
      printType: "BOOK",
      categories: ["Juvenile Fiction"],
      averageRating: 5,
      ratingsCount: 1,
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "1.2.2.0.preview.0",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=HksgDQAAQBAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=HksgDQAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=HksgDQAAQBAJ&dq=harry+potter&hl=&cd=6&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=HksgDQAAQBAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/Harry_Potter_and_the_Philosopher_s_Stone.html?hl=&id=HksgDQAAQBAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "NO_PAGES",
      embeddable: false,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=HksgDQAAQBAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "NONE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "An incredible adventure is about to begin!These new editions of the classic and internationally bestselling, multi-award-winning series feature instantly pick-up-able new jackets by Jonny Duddle, with huge child appeal, to bring Harry ...",
    },
  },
  {
    kind: "books#volume",
    id: "lMM4jgEACAAJ",
    etag: "jlIjy/MnaHc",
    selfLink: "https://www.googleapis.com/books/v1/volumes/lMM4jgEACAAJ",
    volumeInfo: {
      title: "Harry Potter Coloring Book",
      authors: ["Inc. Scholastic"],
      publisher: "Scholastic Incorporated",
      publishedDate: "2015-11-10",
      description:
        "Packed with stunning pieces of artwork from the Warner Bros. archive, this deluxe coloring book gives fans the chance to color in the vivid settings and beloved characters of J.K. Rowling's wizarding world. Containing intricate line drawings used in the making of the Harry Potter films, this coloring book includes fan-favorite scenes, creatures, and characters: from Dobby and baby Norbert to Quidditch games and the unforgettable final battle between Harry and Lord Voldemort. Unique and interactive, Harry Potter: The Official Coloring Book is a perfect collector's item for all fans of the blockbuster saga--whether it's for those who grew up with Harry, Ron, and Hermione, or those who are discovering the magic for the very first time.",
      industryIdentifiers: [
        {
          type: "ISBN_10",
          identifier: "1338029991",
        },
        {
          type: "ISBN_13",
          identifier: "9781338029994",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 96,
      printType: "BOOK",
      categories: ["Juvenile Fiction"],
      averageRating: 3,
      ratingsCount: 2,
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "preview-1.0.0",
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=lMM4jgEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=lMM4jgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=lMM4jgEACAAJ&dq=harry+potter&hl=&cd=7&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=lMM4jgEACAAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/Harry_Potter_Coloring_Book.html?hl=&id=lMM4jgEACAAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "NO_PAGES",
      embeddable: false,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=lMM4jgEACAAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "NONE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "Filled with intricate illustrations and elaborate designs used in the making of the Harry Potter films, this book invites you to imbue the wizarding world with color in your own explorations of Hogwarts Castle, the Forbidden Forest, and ...",
    },
  },
  {
    kind: "books#volume",
    id: "9DUeyAEACAAJ",
    etag: "vl4LcUx+15U",
    selfLink: "https://www.googleapis.com/books/v1/volumes/9DUeyAEACAAJ",
    volumeInfo: {
      title: "כבידתך בי-re'l ha-דורות",
      authors: ["J. K. Rowling"],
      publishedDate: "2019",
      description:
        "Quidditch through the Ages is a comprehensive guide to Quidditch and the ultimate resource for anyone interested in the magical world and its most popular sport. Written by Kennillworthy Whisp (aka J.K. Rowling), it is charmingly reproduced as if it were a facsimile of the very copy from the library of the Hogwarts School of Witchraft and Wizardry.",
      industryIdentifiers: [
        {
          type: "ISBN_10",
          identifier: "9652010006",
        },
        {
          type: "ISBN_13",
          identifier: "9789652010001",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 120,
      printType: "BOOK",
      categories: ["Sports stories"],
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "preview-1.0.0",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=9DUeyAEACAAJ&dq=harry+potter&hl=&cd=8&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=9DUeyAEACAAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/%D7%9B%D7%91%D7%99%D7%93%D7%AA%D7%9A_%D7%91%D7%99_re_l_ha_%D7%93%D7%95%D7%A8%D7%95%D7%AA.html?hl=&id=9DUeyAEACAAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "NO_PAGES",
      embeddable: false,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=9DUeyAEACAAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "NONE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "Quidditch through the Ages is a comprehensive guide to Quidditch and the ultimate resource for anyone interested in the magical world and its most popular sport.",
    },
  },
  {
    kind: "books#volume",
    id: "968eEAAAQBAJ",
    etag: "LRcVVwhrb5Y",
    selfLink: "https://www.googleapis.com/books/v1/volumes/968eEAAAQBAJ",
    volumeInfo: {
      title: "Harry Potter: The Wand Collection (Book)",
      authors: ["Monique Peterson"],
      publisher: "Insight Editions",
      publishedDate: "2017-11-14",
      description:
        "Discover the wands of your favorite Harry Potter characters. In the Harry Potter films, each wand is as unique as the witch or wizard who wields it. From Hermione Granger’s elegant, vine-wrapped wand to the bone-inlaid wands of the Death Eaters, each was designed and crafted by the filmmakers to reflect its owner’s identity. Harry Potter: The Wand Collection is a visual guide to these magical wands, their makers, and the characters who mastered them. Profiles of each wand feature stunning new photography of the original props, wand statistics, insights from the cast and crew, and other filmmaking secrets from the Warner Bros. archive. This collectible volume is an ideal resource for both wand-wielding veteran fans seeking to learn the history behind these beloved items and a new generation just beginning their journey into the wizarding world.",
      industryIdentifiers: [
        {
          type: "ISBN_13",
          identifier: "9781683831884",
        },
        {
          type: "ISBN_10",
          identifier: "1683831888",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 154,
      printType: "BOOK",
      categories: ["Performing Arts"],
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "preview-1.0.0",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=968eEAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=968eEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=968eEAAAQBAJ&printsec=frontcover&dq=harry+potter&hl=&cd=9&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=968eEAAAQBAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/Harry_Potter_The_Wand_Collection_Book.html?hl=&id=968eEAAAQBAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "PARTIAL",
      embeddable: true,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED_FOR_ACCESSIBILITY",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=968eEAAAQBAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "SAMPLE",
      quoteSharingAllowed: false,
    },
    searchInfo: {
      textSnippet:
        "This collectible volume is an ideal resource for both wand-wielding veteran fans seeking to learn the history behind these beloved items and a new generation just beginning their journey into the wizarding world.",
    },
  },
  {
    kind: "books#volume",
    id: "KC_WvQEACAAJ",
    etag: "nqg2z9O/h8E",
    selfLink: "https://www.googleapis.com/books/v1/volumes/KC_WvQEACAAJ",
    volumeInfo: {
      title: "הארי פוטר ואוצרות המוות",
      authors: ["J. K. Rowling", "ג'י. קי רולינג"],
      publisher: "Yedioth Ahronoth Books",
      publishedDate: "2007",
      description:
        "Harry, Ron, and Hermione, on the run, receive help from unexpected quarters and old friends as they set out to search and destroy the hidden pieces of the enemy wizard's soul, and discover the truth about Harry's mentor.",
      industryIdentifiers: [
        {
          type: "ISBN_10",
          identifier: "9654826356",
        },
        {
          type: "ISBN_13",
          identifier: "9789654826358",
        },
      ],
      readingModes: {
        text: false,
        image: false,
      },
      pageCount: 683,
      printType: "BOOK",
      categories: ["Juvenile Fiction"],
      maturityRating: "NOT_MATURE",
      allowAnonLogging: false,
      contentVersion: "preview-1.0.0",
      panelizationSummary: {
        containsEpubBubbles: false,
        containsImageBubbles: false,
      },
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=KC_WvQEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        thumbnail:
          "http://books.google.com/books/content?id=KC_WvQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      },
      language: "en",
      previewLink:
        "http://books.google.com/books?id=KC_WvQEACAAJ&dq=harry+potter&hl=&cd=10&source=gbs_api",
      infoLink:
        "http://books.google.com/books?id=KC_WvQEACAAJ&dq=harry+potter&hl=&source=gbs_api",
      canonicalVolumeLink:
        "https://books.google.com/books/about/%D7%94%D7%90%D7%A8%D7%99_%D7%A4%D7%95%D7%98%D7%A8_%D7%95%D7%90%D7%95%D7%A6%D7%A8%D7%95%D7%AA_%D7%94%D7%9E%D7%95.html?hl=&id=KC_WvQEACAAJ",
    },
    saleInfo: {
      country: "IL",
      saleability: "NOT_FOR_SALE",
      isEbook: false,
    },
    accessInfo: {
      country: "IL",
      viewability: "NO_PAGES",
      embeddable: false,
      publicDomain: false,
      textToSpeechPermission: "ALLOWED",
      epub: {
        isAvailable: false,
      },
      pdf: {
        isAvailable: false,
      },
      webReaderLink:
        "http://play.google.com/books/reader?id=KC_WvQEACAAJ&hl=&printsec=frontcover&source=gbs_api",
      accessViewStatus: "NONE",
      quoteSharingAllowed: false,
    },
  },
];*/
// uiController.renderBooks(books);

uiController.form.addEventListener("submit", searchHandler);
