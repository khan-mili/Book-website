let books = [
    {
        title: "পথের পাঁচালী",
        author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
        pages: 300,
        image: "https://example.com/patherpanchali.jpg",
        details: "একটি গ্রামীণ বাঙালি ছেলের জীবনের গল্প।"
    },
    {
        title: "গোরা",
        author: "রবীন্দ্রনাথ ঠাকুর",
        pages: 350,
        image: "https://example.com/gora.jpg",
        details: "একটি সামাজিক ও রাজনৈতিক উপন্যাস।"
    },
    {
        title: "শ্রীকান্ত",
        author: "স্বরচিতনন্দন",
        pages: 400,
        image: "https://example.com/srikanta.jpg",
        details: "শ্রীকান্তের বিভিন্ন জীবনের অভিজ্ঞতার উপর ভিত্তি করে লেখা।"
    },
    {
        title: "দেবদাস",
        author: "শরৎচন্দ্র চট্টোপাধ্যায়",
        pages: 320,
        image: "https://example.com/devdas.jpg",
        details: "একটি বিখ্যাত প্রেম কাহিনী।"
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        pages: 432,
        image: "https://example.com/pride_and_prejudice.jpg",
        details: "A romantic novel set in early 19th-century England, exploring themes of love, marriage, and social class."
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        pages: 224,
        image: "https://example.com/the_catcher_in_the_rye.jpg",
        details: "A coming-of-age novel narrated by a teenager named Holden Caulfield, exploring themes of alienation and identity."
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        pages: 180,
        image: "https://example.com/great_gatsby.jpg",
        details: "A novel depicting the decadence and moral decay of the American upper class in the 1920s."
    },
];

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    } else {
        alert('No books found. Initializing with example books.');
    }
}

async function fetchBookDetails(title) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?title=${title}`);
        const data = await response.json();
        if (data.docs.length > 0) {
            const book = data.docs[0];
            return {
                coverImage: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
                summary: book.first_sentence ? book.first_sentence[0] : 'No summary available.'
            };
        } else {
            return { coverImage: '', summary: 'No details available.' };
        }
    } catch (error) {
        console.error('Error fetching book details:', error);
        return { coverImage: '', summary: 'Error fetching details.' };
    }
}

async function viewBook(index) {
    const book = books[index];
    const bookDetails = document.getElementById('book-details');
    const fetchedDetails = await fetchBookDetails(book.title);

    bookDetails.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <p><strong>Details:</strong> ${book.details}</p>
        <p><strong>Summary:</strong> ${fetchedDetails.summary}</p>
        <img src="${fetchedDetails.coverImage}" alt="${book.title}" style="width:200px;">
    `;
}

async function renderBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear previous list
    books.forEach((book, index) => {
        const bookItem = document.createElement('li');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <span>${book.title} by ${book.author}</span>
            <button onclick="viewBook(${index})">View</button>
            <button onclick="removeBook(${index})">Remove</button>
        `;
        bookList.appendChild(bookItem);
    });
}

document.getElementById('add-book-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const image = document.getElementById('image').value;
    const details = document.getElementById('details').value;

    books.push({ title, author, pages, image, details });
    saveBooks();
    renderBooks();
});

function removeBook(index) {
    books.splice(index, 1);
    saveBooks();
    renderBooks();
}

window.onload = function() {
    loadBooks();
    renderBooks();
};
