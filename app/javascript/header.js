
async function renderAHeader() {
    let html = '';
    let htmlSegment = renderHeader();
    html += htmlSegment;
    let container = document.getElementById('container-nav');
    container.innerHTML = html;
};

function renderHeader() {

    return (
        `<nav class="navbar navbar-dark navbar-expand-sm">
        <div class="navbar-brand d-sm-inline-block"><a href="/index.html"><img src="/images/logo3.png">Hand Me Down</a></div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#myTogglerNav"
            aria-controls="myTogglerNav" aria-expanded="false" aria-label="Toggle navigation"><span
                class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="myTogglerNav">
            <div class="navbar-nav">
                <a class="nav-item nav-link" href="/html/book-search.html">Search Books</a>
                <a class="nav-item nav-link" href="/html/sell-books.html">Sell Books</a>
                <a class="nav-item nav-link" href="#">Contact Us</a>
            </div>
        </div>
    </nav>`
    )
};