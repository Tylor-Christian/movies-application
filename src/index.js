/**
 * es6 modules and imports
 */
import sayHello from './hello';

sayHello('World');

$("#myDiv").addClass('hide');

const post = require('./api.js');

// const apiLink = "http://www.omdbapi.com/?t=";
// const apiKey = "&apikey=46042177";
//
// function apiMovieData(title) {
//     $.ajax(apiLink + title + apiKey).done((data) => {
//         console.log(data);
//         $("").append(data.Poster);
//     });
// }
// apiMovieData("deadpool");

/**
 * require style imports
 */
function moviesRefresh() {
    post.getMovies().then((movies) => {
        $("#movies").html("");
        console.log('Here are all the movies:');
        console.log(movies);
        movies.forEach(({title, rating, id}) => {
            $("#movies").append(`
                <div class="card col-4 text-dark m-1">
                    <img class="card-img-top" src="" alt="Movie Image">
                    <div class="card-body">
                        <h5 class="card-title"><h2>${title}</h2></h5>
                           <p class="card-text">Movie description</p>
                            <button id=${id} type="button" class="btn btn-sm btn-outline-primary editButton" data-toggle="modal" data-target="#editModal">Edit</button>
                    </div>
                </div>
                <!--<div><h2>${title}</h2> Rating: ${rating}/5</div>-->
        <!--<button id=${id} type="button" class="btn btn-sm btn-outline-primary editButton" data-toggle="modal" data-target="#editModal">Edit</button>-->`);
            console.log(`id#${id} - ${title} - rating: ${rating}`);
        });
        $('#loader').addClass('hide');
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