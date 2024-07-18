displayPopularMovies();

async function displayPopularMovies() {
    let movies = await getPopularMovies();

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
        let titleElement = movieCard.querySelector('.card-title');
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

        movieRow.appendChild(movieCard);

    });
}