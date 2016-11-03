var artistTree = {};
var currentNode = artistTree;
var pastArtists = [];


//GET DATA FROM FORM FOR INITIAL ARTIST
document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchArtists(document.getElementById('query').value);
}, false);


//FETCH INITIAL ARTIST AND FIND SIMILAR ARTISTS
var searchArtists = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            var firstArtist = response.artists.items[0]
            artistTree = {
                id: firstArtist.id,
                children: [],
                data: {
                    name: firstArtist.name,
                    image: firstArtist.images[0],
                    uri: firstArtist.uri
                }
            }
        pastArtists.push(firstArtist.id)
        fetchRelevantArtists(artistTree.id, artistTree)
        }
    });
};

//SELECT NEXT RELEVANT ARTISTS
var selectNextRelevantArtist = function(artistId, currentNode){
    var newCurrentIndex = _.findIndex(currentNode.children, {id: artistId})
    currentNode = currentNode.children[newCurrentIndex]
    fetchRelevantArtists(artistId, currentNode)
}

//FETCH RELEVANT ARTISTS FROM SPOTIFY
var fetchRelevantArtists = function(artistId, currentNode){
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/'+artistId+'/related-artists',
        success: function (response) {
            var newArtists = response.artists.filter((artist)=>{return pastArtists.indexOf(artist.id) === -1})
            newArtists.slice(0,5).forEach((artist)=>{
                object = {
                    id: artist.id,                    
                    children: [],
                    data: {
                        name: artist.name,
                        image: artist.images[0],
                        uri: artist.uri
                    }   
                }
                pastArtists.push(artist.id)
                if (currentNode['children']) currentNode['children'].push(object)
                else currentNode['children'] = [object]
            })
            console.log('updated artistTree', artistTree)
            updateD3Graph(artistTree, currentNode)
        }
    });
}

