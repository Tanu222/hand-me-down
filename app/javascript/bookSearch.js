//console.log("Inside javascript of book-search")

let books;

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
    `<section class="row book">
          <img src="${imageUrl}" class="col-lg-2 col-sm-3 col-6" />
          <div class="article-contents col-lg-9 col-sm-9 col-6">
             <div class="article-title1"><a href="./book-detail.html?id=${book.id}">${book.title}</a></div>
             <div class="article-subtitle">${book.publication} publications</div>
             <div class="article-subtitle">By <span class="bold">${book.author}</span></div>
             <div class="price">₹ ${book.price}</div>
             <div class="contact d-none d-sm-block">Email id :<a href="mailto:${book.seller_email}">${book.seller_email}</a></div>
          </div>         
      </section>`
  )
}

// var searchBar = document.getElementById('search-bar')
// searchBar.addEventListener("keydown", function (e) {
//   if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
//     validate(e);
//   }
// });


// function validate(e) {
//   var text = e.target.value;
//   console.log(text);
// }


function searchBook() {

  let input = document.getElementById('search-bar').value
  input = input.toLowerCase();

  fetch(API_SERVER + '/api/books/search?keyword='+input)
  .then(response => response.json())
  .then(data => {
    books = data;
    console.log(books);
    renderBooks();
  })
  .catch(error => {
    console.log('There has been a problem with your fetch operation:', error);
  });


  // let x = document.getElementsByClassName('article-title1');
  // let section = document.getElementsByClassName('book');
  // for (i = 0; i < x.length; i++) {
  //   if (!x[i].innerHTML.toLowerCase().includes(input)) {
  //     section[i].style.display = "none";
  //   }
  //   else {
  //     section[i].style.display = "";
  //   }
  // }
}

