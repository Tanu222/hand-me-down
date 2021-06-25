//console.log("Inside javascript of book-search")

let books;
const API_SERVER = 'https://handmidown.herokuapp.com';


fetch(API_SERVER + '/api/books/all')
  .then(response => response.json())
  .then(data => {
    books = data;
    console.log(books);
    renderBooks();
  })
  .catch(error => {
    console.log('There has been a problem with your fetch operation:', error);
  });

async function renderBooks() {
  let html = '';
  books.forEach(book => {
    let htmlSegment = renderBook(book);
    html += htmlSegment;
  });

  let container = document.getElementById('details');
  container.innerHTML = html;
}

function renderBook(book) {

  let imageUrl;
  if (book.image_url) {
    imageUrl = "../upload/" + book.image_url;
  } else {
    imageUrl = "../images/books.jpeg";
  }

  return (
    `<section class="row">
          <img src="${imageUrl}" class="col-lg-2 col-sm-3 col-xs-3" />
          <div class="article-contents col-lg-9 col-sm-9">
             <div class="article-title1"><a href="./book-detail.html?id=${book.id}">${book.title}</a></div>
             <div class="article-subtitle">${book.publication} publications</div>
             <div class="article-subtitle">By <span class="bold">${book.author}</span></div>
             <div class="price">₹ ${book.price}</div>
             <div class="contact">Email id : ${book.seller_email}</div>
          </div>         
      </section>`
  )
}

