const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDdiNzg0N2ZkN2EyNTUyNmJhMjZkZjlhMTU3OWQzYiIsIm5iZiI6MTcyMTMzNDY4NC40MDEyNzIsInN1YiI6IjY2OTk2YzI1MDM4NTk5MzU0NjE0M2MyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-ki1hfwTTCrKhlnuullNEO7eQKfugdzoNYzfZQkrzhM';

/**
 * Fetches and returns a list of popular movies currently playing in theaters
 * @returns {Object} A list of currently playing movies
 * @throws {Error} If the network response is not ok
 */
async function getPopularMovies() {
    const popularMoviesURL = `https://api.themoviedb.org/3/movie/popular`;

    try{
        let response = await fetch(popularMoviesURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        })
        
        if(!response.ok) throw new Error("Network response was not ok");

        let popularMovies = await response.json();
        return popularMovies.results;

    } catch (error) {
        console.error(`Popular Movies Fetch Error: ${error}`)
        return [];
    }
}

/**
 * Fetches and returns a list of Now Playing movies currently playing in theaters
 * @returns {Object} A list of currently playing movies
 * @throws {Error} if the network response is not ok
 */
async function getNowPlayingMovies() {
    const nowPlayingMoviesURL = `https://api.themoviedb.org/3/movie/now_playing`;

    try {
        let response = await fetch(nowPlayingMoviesURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok");

        let nowPlayingMovies = await response.json();
        return nowPlayingMovies.results;
    
    }catch (error) {
        console.error(`Now Playing Movies Fetch Error: ${error}`);
        return [];
    }
}

async function getMoviesByQuery(query) {
    //https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1
    const moviesByQueryURL = `https://api.themoviedb.org/3/search/movie?query=${query}`;

    try {
        let response = await fetch(moviesByQueryURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok");

        let moviesByQuery = await response.json();
        return moviesByQuery.results;
    
    }catch (error) {
        console.error(`Search Movies Fetch Error: ${error}`);
        return [];
    }
}




/**
 * 
 * @param {number} movieId 
 * @returns return a movie object from TMDB API
 */
async function getMovie(movieId) {
    //https://api.themoviedb.org/3/movie/{movie_id}
    const movieURL = `https://api.themoviedb.org/3/movie/${movieId}`;

    try {
        let response = await fetch(movieURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok");

        let movie = await response.json();
        return movie;
    
    }catch (error) {
        console.error(`Get Movies Fetch Error: ${error}`);
        return null;
    }
}

async function getMovieRating(movieId) {
    const movieURL = `https://api.themoviedb.org/3/movie/${movieId}/release_dates`;

    try {
        let response = await fetch(movieURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok");

        let releaseDates = await response.json();
        let usReleaseDates = releaseDates.results.find(rd => rd.iso_3166_1 === 'US');

        if(!usReleaseDates) return "NR";

        let releaseDate = usReleaseDates.release_dates.find(rd => rd.certification !='');

        return releaseDate ? releaseDate.certification : "NR";
    
    }catch (error) {
        console.error(`Get Movies Fetch Error: ${error}`);
        return "NR";
    }
}

/**
 * 
 * @param {*} movieId 
 * @returns returns a trailer for the movie
 */
async function getMovieVideos(movieId) {
    //https://api.themoviedb.org/3/movie/{movie_id}/videos
    const videosURL = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

    try {
        let response = await fetch(videosURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok");

        let videos = await response.json();
        return videos.results;
    
    }catch (error) {
        console.error(`Get Trailer Fetch Error: ${error}`);
        return null;
    }
}

/**
 * 
 * @param {*} movieId 
 * @returns cast and crew for a movie
 */
async function getMovieCredits(movieId) {
    //https://api.themoviedb.org/3/movie/{movie_id}/credits
    const creditsURL = `https://api.themoviedb.org/3/movie/${movieId}/credits`;

    try {
        let response = await fetch(creditsURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok");

        let credits = await response.json();
        return credits;
    
    }catch (error) {
        console.error(`Get Credits Fetch Error: ${error}`);
        return [];
    }
}

async function getMovieGenreList() {
    const movieGenresListURL = `https://api.themoviedb.org/3/genre/movie/list`;

    try {
        let response = await fetch(movieGenresListURL, {
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was on ok");

        let movieGenresList = await response.json();
        return movieGenresList;

    }catch (error) {
        console.error(`Get Genre List Fetch Error: ${error}`);
        return [];
    }
}