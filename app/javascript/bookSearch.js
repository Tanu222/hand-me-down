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
  let count = books.length;
  if(count==0){
    notFound();
  }
  let contain = document.getElementById('count');
  contain.innerHTML = `<p>${count} books found</p>`;
  let html = '';
  books.forEach(book => {
    let htmlSegment = renderBook(book);
    html += htmlSegment;
  });

  let container = document.getElementById('details');
  container.innerHTML = html;
}

function notFound(){
  let html = '';
  let htmlSegment = `<p>Sorry! We could not find any matches. Please change your search criteria.</p>`;
  html += htmlSegment;

  let container = document.getElementById('not-found');
  container.innerHTML = html;
}

function renderBook(book) {
  let y= book.create_ts.substr(0,4);
  let m = book.create_ts.substr(5,2);
  let dat = book.create_ts.substr(8,2)
  let d = new Date(y, m-1, dat);
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  let date =(`${da}-${mo}-${ye}`);
  

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
             <div class="article-subtitle d-none d-sm-block">Posted by <span class="bold">${book.seller_username}</span> on <span class="bold">${date}</span></div>
             <div class="article-subtitle">${book.publication} publications</div>
             <div class="article-subtitle">By <span class="bold">${book.author}</span></div>
             <div class="price">₹ ${book.price}</div>
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

