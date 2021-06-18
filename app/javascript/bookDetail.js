//console.log("Inside javascript of book-search");

let book;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const bookId = urlParams.get('id')

fetch('http://127.0.0.1:1337/book?id='+bookId)
    .then(response => response.json())
    .then(data => {
        book = data;
        console.log(book);
        renderABook(book);
    })
    .catch(error => {
        console.log('There has been a problem with your fetch operation:', error);
    });


async function renderABook(book) {
    let html = '';
    let htmlSegment = renderBook(book);
    html += htmlSegment;
    let container = document.getElementById('book');
    container.innerHTML = html;
};





function renderBook(book) {
    return (
        `<div class="row my-2">
        <div class=" offset-2 col-md-3">
            <img src="../images/books.jpeg" class="">
            <div class="price">Price: ${book.price}</div>
        </div>
        <div class="col-md-4">
            <div class="title">${book.title}</div>
            <hr>
            <div class="author inline"><span>Author: </span>${book.author}</div>
            <div class="publication"><span>Publication: </span>${book.publication}</div>
            <div class="subject"><span>Subject: </span>${book.subject}</div>
            <div class="year"><span>Year: </span>${book.year}</div>
            <hr>
            <div class="contact">
                <div class="contact-title">Contact Details</div>
                <div class="name"><span>Name: </span>${book.seller_username}</div>
                <div class="email"><span>Email: </span>${book.seller_email}</div>
                <div class="number"><span>Phone: </span>${book.seller_phone}</div>
            </div>
        </div>
    </div>
    <hr>
    <div class="row description">
        <div class="offset-2 col-md-7">
            <div class="description-title">Description</div>
            <div class="content">${book.description}</div>
        </div>
    </div>`
    )
};
