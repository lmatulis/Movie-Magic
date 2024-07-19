displayNowPlayingMovies();

async function displayPopularMovies() {
    let movies = await getPopularMovies();

    let pageTitle = document.getElementById("page-title");
    pageTitle.innerHTML = "";
    pageTitle.innerHTML = "Popular";

    displayMovies(movies);
}

async function displayNowPlayingMovies() {
    let movies = await getNowPlayingMovies();

    let pageTitle = document.getElementById("page-title");
    pageTitle.innerHTML = "";
    pageTitle.innerHTML = "Now Playing";

    displayMovies(movies);
}

function displayMovies(movies) {
    //get the movie card template
    const movieCardTemplate = document.getElementById("movie-card-template");
    //find the movie row element where all the movies go
    const movieRow = document.getElementById("movie-row");
    movieRow.innerHTML = "";
    
    movies.forEach(movie => {
        
        let movieCard = document.importNode(movieCardTemplate.content, true);

        //modify the card for the current movie
        let titleElement = movieCard.querySelector('.card-body > .card-title');
        titleElement.textContent = movie.title;

        let descriptionElement = movieCard.querySelector('.card-text');
        let date = new Date(movie.release_date)
        descriptionElement.textContent = date.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});

        let imageElement = movieCard.querySelector('.card-img-top');
        let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        if(movie.poster_path == null) {
            poster_path = "/img/poster.png";
        }

        imageElement.setAttribute('src', poster_path);

        //set the movie card fav buttons correctly
        let removeFavButton = movieCard.querySelector('[data-fav="true"]');
        removeFavButton.setAttribute('data-movieid', movie.id);

        let addFavButton = movieCard.querySelector('[data-fav="false"]');
        addFavButton.setAttribute('data-movieid', movie.id);

        if(isFavoriteMovie(movie.id)){
            addFavButton.style.display = 'none';
            removeFavButton.style.display = 'block';
        } else {
            addFavButton.style.display = 'block';
            removeFavButton.style.display = 'none';
        }

        movieRow.appendChild(movieCard);

    });
}

/* #region favorite movies */

async function addFavoriteMovie(btn) {
    let movieId = btn.getAttribute('data-movieid');
    let favorites = getFavoriteMovies();
    let duplicateMovie = favorites.find(movie => movie.id == movieId);

    if(duplicateMovie == undefined) {
        let newFavorite = await getMovie(movieId);

        if(newFavorite != undefined) {
            favorites.push(newFavorite);

            saveFavoriteMovies(favorites);
        }
    }
}

//retrieves local storage data of favorite movies if it exists
function getFavoriteMovies(){
    let favoriteMovies = localStorage.getItem("mm-favorite-movies");

    if(favoriteMovies == null) {
        favoriteMovies = [];
        saveFavoriteMovies(favoriteMovies);
    } else {
        favoriteMovies = JSON.parse(favoriteMovies);
    }

    return favoriteMovies;
}

//save selected movie to local storage
function saveFavoriteMovies(movies) {
    let moviesJSON = JSON.stringify(movies);
    localStorage.setItem("mm-favorite-movies", moviesJSON)
}


function isFavoriteMovie(movieId) {
    let favoriteMovies = getFavoriteMovies();

    if(!favoriteMovies){
        return false;
    }

    return favoriteMovies.some(movie => movie.id == movieId)
}

/* #endregion favorite movies */