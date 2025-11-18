document.addEventListener('DOMContentLoaded', () => {

    const TMDB_API_KEY = "2b46e8270dbc318775cdf9106e1255fc";

    const API_CONTAINER = document.getElementById('peliculas-api-container');
    const API_LOADING = document.getElementById('api-loading');

    // IDs de películas reales de TMDB
    const movieIds = [
        76600,   // Avatar 2
        693134,  // Dune Part Two
        872585,  // Oppenheimer
        346698   // Barbie
    ];

    function createMovieCard(movie) {
        const card = document.createElement('article');
        card.classList.add('api-card');

        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'imagenes/placeholder.jpg';

        card.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="${posterUrl}" alt="Poster de ${movie.title}">
            <p><strong>Fecha de Estreno:</strong> ${movie.release_date}</p>
            <p>${movie.overview.substring(0, 120)}...</p>
        `;
        return card;
    }

    async function fetchMoviesFromTMDB() {

        if (API_LOADING) API_LOADING.style.display = 'block';
        if (API_CONTAINER) API_CONTAINER.innerHTML = '';

        try {

            const fetchRequests = movieIds.map(id =>
                fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES`)
                    .then(res => res.json())
            );

            const movies = await Promise.all(fetchRequests);

            movies.forEach(movie => {
                if (movie.id) API_CONTAINER.appendChild(createMovieCard(movie));
            });

        } catch (error) {
            API_CONTAINER.innerHTML = `<p style="color:red">Error al obtener datos: ${error.message}</p>`;
        } finally {
            if (API_LOADING) API_LOADING.style.display = 'none';
        }
    }

    fetchMoviesFromTMDB();
});