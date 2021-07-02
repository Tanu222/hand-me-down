//console.log("Inside javascript of book-search");


let book;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const bookId = urlParams.get('id')

fetch(API_SERVER + '/api/books?id='+bookId)
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
    let imageUrl;
    if (book.image_url) {
      imageUrl = "../upload/" + book.image_url;
    } else {
      imageUrl = "../images/books.jpeg";
    }

    return (
        `<div class="row my-2 mt-4">
        <div class=" offset-md-1 col-md-5  col-lg-3 offset-lg-2 book-image ">
            <img src="${imageUrl}" class="">
            <div class="price">Price: ${book.price}</div>
        </div>
        <div class="col-md-5 ml-5">
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
                <div class="email"><span>Email: </span><a href="mailto:${book.seller_email}">${book.seller_email}</a></div>
                <div class="number"><span>Phone: </span><a href="tel:${book.seller_phone}">${book.seller_phone}</a></div>
            </div>
        </div>
    </div>
    <hr>
    <div class="row description ml-4">
        <div class="offset-md-1 offset-lg-2  col-md-7">
            <div class="description-title">Description</div>
            <div class="content">${book.description}</div>
        </div>
    </div>`
    )
};
