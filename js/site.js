

//displays popular movies
async function displayPopularMovies() {
    let movies = await getPopularMovies();

    let pageTitle = document.getElementById("page-title");
    pageTitle.innerHTML = "";
    pageTitle.innerHTML = "Popular";

    displayMovies(movies);
}

// Displays now playing movies
async function displayNowPlayingMovies() {
    let movies = await getNowPlayingMovies();

    let pageTitle = document.getElementById("page-title");
    pageTitle.innerHTML = "";
    pageTitle.innerHTML = "Now Playing";

    displayMovies(movies);
}

//displays favorite movies from local storage
async function displayFavoriteMovies() {
    let movies = getFavoriteMovies();
    let pageTitle = document.getElementById("page-title");
    pageTitle.innerHTML = "";
    pageTitle.innerHTML = "Favorites";
    displayMovies(movies);
}

//displays search results
async function displaySearchResults() {
    let query = document.getElementById("movie-search").value;
    
    let encodedValue = encodeURIComponent(query);
    let movies = await getMoviesByQuery(encodedValue);

    //another way to change the page title
    document.getElementById("page-title").innerHTML = `Search Results for: ${query}`;

    displayMovies(movies);

    uncheckButtons();
    
}

//displays the details for a given movie
//the id will be passed by query string
// used on the movieDetails page
async function displayMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const defaultMovieId = '550';
    let movieId = urlParams.get("id") || defaultMovieId;

    let movie = await getMovie(movieId);

    if(!movie) {
        movieId= defaultMovieId;
        movie = await getMovie(movieId);
    }

    //set bg image
    let movieDetails = document.getElementById("movie-details");
    let backdrop_path = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    if(movie.backdrop_path == null) {
        backdrop_path = '/img/Backdrop.jpg'
    }
    movieDetails.style.background = `url(${backdrop_path}), linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.9))`;
    movieDetails.style.backgroundPosition = 'cover';
    movieDetails.style.backgroundRepeat = "no-repeat";
    movieDetails.style.backgroundBlendMode = 'overlay'

    //set poster image
    let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    if(movie.poster_path == null) {
        poster_path = `/img/poster.png`;
    }
    document.getElementById("movie-poster").src = poster_path;

    //set the title
    document.getElementById("movie-title").innerHTML = movie.title;

    //display the movie certification
    document.getElementById("movie-certification").innerHTML = await getMovieRating(movie.id);

    //display the release date
    document.getElementById("movie-released").innerHTML = (new Date(movie.release_date).toLocaleDateString());

    //display the runtime
    let minutes = movie.runtime % 60;
    let hours = (movie.runtime - minutes) / 60;
    document.getElementById("movie-runtime").textContent = `${hours}h ${minutes}m`

    //display the movie genres
    document.getElementById("movie-genres").innerHTML = displayGenres(movie);

    //display the tagline
    document.getElementById("movie-tagline").innerText = movie.tagline;
    
    //display the overview
    document.getElementById("movie-overview").innerText = movie.overview;

    //display the user rating
    document.getElementById("movie-rating").innerHTML = `${(movie.vote_average * 10).toFixed(0)}% User Score`;

    //load the trailer
    let videos = await getMovieVideos(movieId);
    if(videos.length < 1){
        document.getElementById("btn-trailer").style.display = 'none';
    } else {
        document.getElementById("btn-trailer").style.display = 'block';
    }

    //display actor credits for top 10 actors
    displayCredits(movieId);
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

        let infoButton = movieCard.querySelector('[data-detail');
        infoButton.href = `/movieDetails.html?id=${movie.id}`;

        movieRow.appendChild(movieCard);

    });
}

function displayGenres(movie) {

    let genresTemplate = '';

    movie.genres.forEach(genre => {
        genresTemplate += `<span class="badge text-bg-primary me-1">${genre.name}</span>`;
    })

    return genresTemplate;
}

async function displayCredits(movieId) {
    //get the cast from tmdb 
    let credits = await getMovieCredits(movieId);

    //pull the top ten actors from the array
    let topBilledCast = credits.cast.slice(0,10);

    //get the container to drop HTML
    let slideContainer = document.getElementById("actors-slide-container");
    slideContainer.innerHTML = "";

    //get the template
    let actorSlideTemplate = document.getElementById("actor-slide");

    topBilledCast.forEach(actor =>{
        let slide = actorSlideTemplate.content.cloneNode(true);

        if(actor.profile_path != null) {
            slide.querySelector("img").src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`;
        } else {
            slide.querySelector("img").src = "/img/ProfileImage.jpg"
        }

        slide.querySelector("[data-name]").textContent = actor.name;
        slide.querySelector("[data-character]").textContent = actor.character;

        slideContainer.appendChild(slide);
    });
}

function uncheckButtons() {
    let buttons = document.querySelectorAll('#btnBar .btn-check');

    let checkedButton = Array.from(buttons).find(button => button.checked);

    if(checkedButton) {
        checkedButton.checked = false;
    }
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
    selectAndClickMovieCategory();
}

async function removeFavoriteMovie(btn) {
    let movieId = btn.getAttribute('data-movieid');
    let favorites = getFavoriteMovies();

    if(favorites) {
        favorites = favorites.filter(movie => movie.id != movieId);
        saveFavoriteMovies(favorites);
    }
    selectAndClickMovieCategory();
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

// Find the button bar, locate the selected item, and click it again
function selectAndClickMovieCategory() {
    //get all the buttons in the bar
    //this returns an array of buttons
    let buttons = document.querySelectorAll('#btnBar .btn-check');

    //find the currently selected button
    let checkedButton = Array.from(buttons).find(button => button.checked);

    //call the click event on the checked button
    if(checkedButton) {
        checkedButton.click();
    }
}

/* #endregion favorite movies */

//load trailer
async function loadVideo() {
    let movieId = new URLSearchParams(window.location.search);
    const defaultMovieId = '550';
    movieId = movieId.get("id") || defaultMovieId;

    let videos = await getMovieVideos(movieId);

    if(videos.length > 0) {
        let defaultVideo = videos[0];
        videos = videos.filter(video => video.type == 'Trailer');
        let trailerVideo = videos[0] || defaultVideo;
        document.getElementById("movieModalLabel").textContent = trailerVideo.name;
        document.getElementById("movie-trailer").src = `https://www.youtube.com/embed/${trailerVideo.key}`;
    }
}

async function unloadVideo() {
    document.getElementById("movie-trailer").src = "";
}