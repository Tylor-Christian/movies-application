// /**
//  * es6 modules and imports
//  */
// import sayHello from './hello';
//
// sayHello('World');

$("#myDiv").addClass('hide');

const post = require('./api.js');

// const apiLink = "http://www.omdbapi.com/?t=";
// const apiKey = "&apikey=46042177";
//
// function apiMovieData(title) {
//     $.ajax(apiLink + title + apiKey).done((data) => {
//         console.log(data);
//         let movieImage = data.Poster;
//         $(".moviePoster").src = movieImage;
//         console.log(movieImage);
//     });
// }

/**
 * require style imports
 */

function moviesRefresh() {
    $('#myDiv').removeClass('show').addClass('hide');
    $('#loader').addClass('show');
    post.getMovies().then((movies) => {
        $("#movies").html("");
        console.log('Here are all the movies:');
        console.log(movies);
        movies.forEach(({title, rating, id}) => {
            $("#movies").append(`
                <div class="card col-3 w-100 bg-primary text-light m-4">
                    <img class="card-img-top moviePoster" src="" alt="Movie Image">
                    <div class="card-body">
                        <h2 class="card-title">${title}</h2>
                        <h4>${rating}/5</h4>
                           <p class="card-text">Movie description</p>
                            <button id=${id} type="button" class="btn btn-sm btn-secondary editButton" data-toggle="modal" data-target="#editModal">Edit</button>
                    </div>
                </div>
                `);
            // apiMovieData(`${title}`);
            console.log(`id#${id} - ${title} - rating: ${rating}`);
        });
        $('#loader').removeClass('show').addClass('hide');
        $('#myDiv').removeClass('hide').addClass('show');
    }).then(() => {
        $('.editButton').click(function () {
            const id = this.id;
            post.grabMovie(id)
                .then(movie => {
                    $('#editMovieID').text(movie.id);
                    $('#titleEdit').val(movie.title);
                })
        })
    })
        .catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

moviesRefresh();

$('#addAMovie').click((e) => {
    e.preventDefault();
    const title = $('#title').val();
    const rating = $('input[name=rating]:checked').val();
    post.addAMovie({title, rating});
    setTimeout(function () {
        moviesRefresh();
    }, 1000);
    $('input[type="text"], text').val('');
    $('.form-group').find('input:radio').prop('checked', false);
});

$('#editAMovie').click(function (e) {
    e.preventDefault();
    let id = $('#editMovieID').text();
    let editTitle = $('#titleEdit').val();
    let editRating = $(`input[name=ratingEdit]:checked`).val();
    post.editAMovie({title: editTitle, rating: editRating}, id);
    setTimeout(function () {
        moviesRefresh();
    }, 1000);
    $('input[type="text"], text').val('');
    $('.form-group').find('input:radio').prop('checked', false);
});

$('#deleteAMovie').click(() => {
    let id = $('#editMovieID').text();
    console.log(id);
    post.deleteAMovie(id);
    setTimeout(function () {
        moviesRefresh();
    }, 1000);
});