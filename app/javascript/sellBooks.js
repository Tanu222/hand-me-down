
let form = document.getElementById('sell-books');
let bookImageUrl;

let submitBook = (e) => {
    console.log('Submit button pressed');
    e.preventDefault();

    let book = {
        "title": e.target.elements.bookName.value,
        "author": e.target.elements.author.value,
        "publication": e.target.elements.publication.value,
        "subject": e.target.elements.subject.value,
        "year": e.target.elements.year.value,
        "description": e.target.elements.description.value,
        "seller_phone": e.target.elements.phone.value,
        "price": e.target.elements.price.value,
        "imageUrl": bookImageUrl,
        "user_name": e.target.elements.name.value,
        "user_email": e.target.elements.email.value
    }
    console.log(JSON.stringify(book));
    
    postData(API_SERVER + '/api/books', { book })
       .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
            window.location.href = "./success.html";
        })
        .catch((err) => {
            console.error(err);
            window.location.href = "./failure.html";
        });
        
    document.getElementById('sell-books').reset();
    //showSuccess();
    return false;
}

function showSuccess() {
    document.getElementById('success').innerHTML =
        `Form Submitted Successfully!
                <a href="./book-search.html">Go to Search Books page</a>`
}


async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects

}

Dropzone.options.myDropzone = {
    //url: 'http://127.0.0.1:1337/upload',
    // autoProcessQueue: false,
    uploadMultiple: false,
    parallelUploads: 1,
    maxFiles: 1,
    maxFilesize: 100,
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
    init: function () {
        dzClosure = this; // Makes sure that 'this' is understood inside the functions below.
    },
    success: function (file, response) {
        console.log("Response:",response)
        bookImageUrl = response.filename;
        console.log("book image url: " + bookImageUrl)
    }
};

