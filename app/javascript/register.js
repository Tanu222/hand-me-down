let form = document.getElementById('register');

let submitUser = (e) => {
    console.log('Submit button pressed');
    e.preventDefault();
    let user = {
        "user_name":e.target.elements.name.value,
        "user_email":e.target.elements.email.value,
        "password":e.target.elements.password.value
    }
    console.log(JSON.stringify(user));
    
    postData(API_SERVER + '/api/users', { user })
       .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
            //window.location.href = "./success.html";
        })
        .catch((err) => {
            console.error(err);
            //window.location.href = "./failure.html";
        });
        
    document.getElementById('register').reset();
    //showSuccess();
    return false;
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
    return response.json();
}