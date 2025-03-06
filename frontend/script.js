document.getElementById("searchButton").addEventListener("click", async function() {
    const BEARER_TOKEN = "";
    // Fetch bearer token
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        alert('You are not logged in!');
        window.location.href = '/index.html';
        return;
    }
    var response = await fetch('/api/get-token', {
        headers: { 'Authorization': `Bearer ${jwt}` }
    });
    if (response.ok) {
        const data = await response.json();
        BEARER_TOKEN = data.bearerToken;
    } else {
        const data = await response.json();
        alert(`Failed to fetch bearer token. : ${data.message}`);
    }

    const searchedCharacterName = document.getElementById('characterName').value.trim();
    const titleName = document.getElementById('titleName').value.trim();
    const selectedType = document.querySelector('input[name="type"]:checked');
    const resultElement = document.getElementById('fullResultParagraph');
    const resultsContainer = document.getElementById('resultsContainer');

    if (!selectedType) {
        alert('Please select whether it is a Movie or a Series.');
        return;
    }

    const typeValue = selectedType.value;

    var finalList = ""; 

    try {
        if(typeValue === "movie"){
            // --------------------------------------    MOVIES     --------------------------------------
            const GET_MOVIE_CAST_DETAILS_URL = `https://api.themoviedb.org/3/search/movie?query=${titleName}`

            var response = await fetch(GET_MOVIE_CAST_DETAILS_URL, {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
                }
            });
        
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const movieInfo = await response.json();
            var movieResults = movieInfo['results']; //['id'];

            var actor = [];

            for (var movie in movieResults){
                var movie_id = movieResults[movie]['id'];
                var MOVIE_CREDITS_URL = `https://api.themoviedb.org/3/movie/${movie_id}/credits`;
            
                response = await fetch(MOVIE_CREDITS_URL, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                    }
                });

                const creditInfoSearchedMovieResponse = await response.json();
                var creditInfoSearchedMovie = creditInfoSearchedMovieResponse['cast'];

                for (var character in creditInfoSearchedMovie){
                    if(creditInfoSearchedMovie[character]['character'].toLowerCase().includes(searchedCharacterName.toLowerCase()))
                        actor.push(creditInfoSearchedMovie[character]['name'])
                }
            }
            
            for (var i in actor){
                console.log(actor[i]);                    
            }

            if(actor.length == 0){
                resultElement.textContent = `Error : Character ${searchedCharacterName} was not found in the movie ${titleName}.`;
                resultsContainer.style.display = 'block';
                return;
            }

            // if (actor.length>1){
            //     alert(`There are more than 1 characters named ${searchedCharacterName} in ${titleName}. Please be more specific.`);
            //     // TODO: Can we mention all the actors names here?
            //     return;
            // }

            var searchForActor = actor[0];
            // finalList = `The actor you are searching for is : ${searchForActor}.\n`

            // ---------------------------------------- SEARCH IN WATCHED MOVIES ----------------------------------------
            const WATCHLIST_MOVIE_API_URL = `https://api.themoviedb.org/3/account//watchlist/movies`;
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
                movie_id = movie['id'];
                var movie_name = movie['title'];

                console.log(`Zendaya: ${movie_name}, ${titleName}`);

                if (String(movie_name).toLowerCase() === titleName.toLowerCase())
                    continue;
                
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
                    if(String(cast[actor]['name']).toLowerCase() === searchForActor.toLowerCase()){
                        finalList += `\t • ${movie_name} as \"${character_name}\"\n`;
                        console.log(`finalList: ${finalList}`);
                        break;
                    } else {
                        console.log(`wtf is happening between ${String(cast[actor]['name']).toLowerCase()} and ${searchForActor}`);
                    }
                }
            }

            // ---------------------------------------- SEARCH IN WATCHED SERIES ----------------------------------------
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
                series_id = series['id'];
                var series_name = series['name'];

                if (String(series_name).toLowerCase() === titleName.toLowerCase())
                    continue;
                
                var SERIES_CREDITS_URL = `https://api.themoviedb.org/3/tv/${series_id}/aggregate_credits`;
                
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
                    if(String(cast[actor]['name']).toLowerCase() === searchForActor.toLowerCase()){
                        var roles = cast[actor]['roles'];
                        finalList  += `\t • ${series_name} as \"${roles[0]['character']}\"`;
                        for (let i = 1; i < roles.length; i++)
                            finalList += `, \"${roles[i]['character']}\"`;
                        finalList += "\n";
                        break;
                    } else {
                        console.log(`wtf is happening between ${String(cast[actor]['name']).toLowerCase()} and ${searchForActor}`);
                    }
                }
            }

        } else if (typeValue === "series") {
            // --------------------------------------    SERIES     --------------------------------------
            const GET_SERIES_CAST_DETAILS_URL = `https://api.themoviedb.org/3/search/tv?query=${titleName}`

            var response = await fetch(GET_SERIES_CAST_DETAILS_URL, {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json"
                }
            });
        
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const seriesInfo = await response.json();
            var seriesResults = seriesInfo['results']; //['id'];

            var actor = [];

            for (var series in seriesResults){
                var series_id = seriesResults[series]['id'];
                var SERIES_CREDITS_URL = `https://api.themoviedb.org/3/tv/${series_id}/aggregate_credits`;
            
                response = await fetch(SERIES_CREDITS_URL, {
                    method: "GET",
                    headers: {
                    "Authorization": `Bearer ${BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                    }
                });

                const creditInfoSearchedSeriesResponse = await response.json();
                var creditInfoSearchedSeries = creditInfoSearchedSeriesResponse['cast'];

                for (var character in creditInfoSearchedSeries){
                    var roles = creditInfoSearchedSeries[character]['roles'];
                    var matched = false;
                    for (var i in roles){
                        if(String(roles[i]['character']).toLowerCase().includes(searchedCharacterName.toLowerCase())){
                            actor.push(creditInfoSearchedSeries[character]['name']);
                            matched = true;
                            break;
                        }
                    }
                    if(matched)
                        break;
                }
            }
            
            for (var i in actor){
                console.log(actor[i]);                    
            }

            if(actor.length == 0){
                resultElement.textContent = `Error : Character ${searchedCharacterName} was not found in the series ${titleName}.`;
                resultsContainer.style.display = 'block';
                return;
            }

            // if (actor.length>1){
            //     alert(`There are more than 1 characters named ${searchedCharacterName} in ${titleName}. Please be more specific.`);
            //     // TODO: Can we mention all the actors names here?
            //     return;
            // }

            var searchForActor = actor[0];
            // finalList = `The actor you are searching for is : ${searchForActor}.\n`

            // ---------------------------------------- SEARCH IN WATCHED MOVIES ----------------------------------------
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
                movie_id = movie['id'];
                var movie_name = movie['title'];

                console.log(`Zendaya: ${movie_name}, ${titleName}`);

                if (String(movie_name).toLowerCase() === titleName.toLowerCase())
                    continue;
                
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
                    if(String(cast[actor]['name']).toLowerCase() === searchForActor.toLowerCase()){
                        finalList += `\t • ${movie_name} as \"${character_name}\"\n`;
                        console.log(`finalList: ${finalList}`);
                        break;
                    } else {
                        console.log(`wtf is happening between ${String(cast[actor]['name']).toLowerCase()} and ${searchForActor}`);
                    }
                }
            }

            // ---------------------------------------- SEARCH IN WATCHED SERIES ----------------------------------------
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
                series_id = series['id'];
                var series_name = series['name'];

                if (String(series_name).toLowerCase() === titleName.toLowerCase())
                    continue;
                
                var SERIES_CREDITS_URL = `https://api.themoviedb.org/3/tv/${series_id}/aggregate_credits`;
                
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
                    if(String(cast[actor]['name']).toLowerCase() === searchForActor.toLowerCase()){
                        var roles = cast[actor]['roles'];
                        finalList  += `\t • ${series_name} as \"${roles[0]['character']}\"`;
                        for (let i = 1; i < roles.length; i++)
                            finalList += `, \"${roles[i]['character']}\"`;
                        finalList += "\n";
                        break;
                    } else {
                        console.log(`wtf is happening between ${String(cast[actor]['name']).toLowerCase()} and ${searchForActor}`);
                    }
                }
            }
        }
        

        if(finalList === ""){
            finalList = `You have not watched anything featuring ${searchForActor} or you might have watched something but haven't marked it as \"watched\" here - in which case, I am useless :\)`;
        } else {
            finalList = `You know ${searchForActor} from: \n`+finalList;
        }

        finalList = `\"${searchedCharacterName}\" in ${titleName} is ${searchForActor}.` + "\n" + finalList;

        resultElement.textContent = finalList;
        resultsContainer.style.display = 'block';
    
    } catch (error) {
        console.error("API call failed:", error);
        document.getElementById("result").textContent = "An error occurred. Check console for details.";
    }

    // TODO:
    // 2) put a loading sign when the results are loading
});

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('jwt');
    window.location.href = '/index.html';
});
