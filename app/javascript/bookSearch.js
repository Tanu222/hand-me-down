//console.log("Inside javascript of book-search")

let books;

fetch('http://127.0.0.1:1337/books')
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
  return (
    `<section class="row">
          <img src="../images/books.jpeg" class="col-2" />
          <div class="article-contents col-9">
             <div class="article-title"><a href="./book-detail.html?id=${book.id}">${book.title}</a></div>
             <div class="article-subtitle">${book.publication} publications</div>
             <div class="price">₹ ${book.price}</div>
             <div class="contact">Email id : ${book.seller_email}</div>
          </div>         
      </section>`
  )
}

