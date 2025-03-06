const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRiNGRjNjZkY2MxZjdhMmE3ZmU2NTgwZDM0ZjE0MCIsIm5iZiI6MTc0MDk4MzgzNi42ODcsInN1YiI6IjY3YzU0ZTFjNmNhOTAzNWE2YTdhNjliNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9kye37VeCy_7AjCClMTprC67HfRJMH5iwsls0WrH06Q'
    }
  };

document.getElementById("searchButton").addEventListener("click", async function() {
        var searchForActorOriginalString = document.getElementById("searchInput").value.trim();
        searchForActor = String(searchForActorOriginalString).toLowerCase();
    
        if (searchForActor === "") {
        document.getElementById("result").textContent = "Please enter something to search.";
        return;
        }

        var finalList = ""; 
        
        const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRiNGRjNjZkY2MxZjdhMmE3ZmU2NTgwZDM0ZjE0MCIsIm5iZiI6MTc0MDk4MzgzNi42ODcsInN1YiI6IjY3YzU0ZTFjNmNhOTAzNWE2YTdhNjliNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9kye37VeCy_7AjCClMTprC67HfRJMH5iwsls0WrH06Q";
    
        try {
            // --------------------------------------    MOVIES     --------------------------------------
            const WATCHLIST_MOVIE_API_URL = `https://api.themoviedb.org/3/account/21855219/watchlist/movies`;
            var response = await fetch(WATCHLIST_MOVIE_API_URL, {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
                }
            });
        
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const watchlistMovies = await response.json();
            const watchlistMoviesArray = watchlistMovies['results'];

            for (var item in watchlistMoviesArray){
                var movie = watchlistMoviesArray[item];
                var movie_id = movie['id'];
                var movie_name = movie['title'];
                var MOVIE_CREDITS_URL = `https://api.themoviedb.org/3/movie/${movie_id}/credits`;
                response = await fetch(MOVIE_CREDITS_URL, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const castResponse = await response.json();
                const cast = castResponse['cast'];

                for (var actor in cast){
                    console.log(`movie id: ${movie_id}, actor: ${cast[actor]['name']}`);
                    var character_name = cast[actor]['character'];
                    if(String(cast[actor]['name']).toLowerCase() === searchForActor){
                        finalList += `${movie_name} as \"${character_name}\"\n`;
                        console.log(`finalList: ${finalList}`);
                        break;
                    } else {
                        console.log(`wtf is happening between ${String(cast[actor]['name']).toLowerCase()} and ${searchForActor}`);
                    }
                }
            }


            // --------------------------------------    SERIES     --------------------------------------
            const WATCHLIST_SERIES_API_URL = `https://api.themoviedb.org/3/account/21855219/watchlist/tv`;
            var response = await fetch(WATCHLIST_SERIES_API_URL, {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
                }
            });
        
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const watchlistSeries = await response.json();
            const watchlistSeriesArray = watchlistSeries['results'];

            for (var item in watchlistSeriesArray){
                var series = watchlistSeriesArray[item];
                var series_id = series['id'];
                var series_name = series['name'];
                var SERIES_CREDITS_URL = `https://api.themoviedb.org/3/tv/${series_id}/credits`;
                response = await fetch(SERIES_CREDITS_URL, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const castResponse = await response.json();
                const cast = castResponse['cast'];

                for (var actor in cast){
                    console.log(`series id: ${series_id}, actor: ${cast[actor]['name']}`);
                    var character_name = cast[actor]['character'];
                    if(String(cast[actor]['name']).toLowerCase() === searchForActor){
                        finalList += `${movie_name} as \"${character_name}\"\n`;
                        console.log(`finalList: ${finalList}`);
                        break;
                    } else {
                        console.log(`wtf is happening between ${String(cast[actor]['name']).toLowerCase()} and ${searchForActor}`);
                    }
                }
            }

            if(finalList === ""){
                finalList = `You have not watched anything featuring ${searchForActorOriginalString} or you might have watched something but haven't marked it as \"watched\" here - in which case, I am useless :\)`;
            } else {
                finalList = `You know ${searchForActorOriginalString} from the following : \n`+finalList;
            }

            document.getElementById("result").textContent = finalList;
            resultElement.style.display = 'block';

            // TODO:
            // 1) get the name of the character they have played in the movie/series - done!
            // 2) search for the characters name in the movie/series instead of the actor - can you do it? that way, a step of google search can be skipped! - like ' "corey" from "fresh off the boat" '
            // 3) make it graphical? can you get the pictures of the actors from the movie/series? look into it!
            // 4) fix the UI, maybe make it better? - can reactjs help improve it? Do you need react at all?
        
        } catch (error) {
            console.error("API call failed:", error);
            document.getElementById("result").textContent = "An error occurred. Check console for details.";
            resultElement.style.display = 'block';
        }
  });
  