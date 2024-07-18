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