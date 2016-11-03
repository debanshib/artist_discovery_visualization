var currentSong;
var playing = false;

//FETCH TRACK AND PLAY FOR SPECIFIC ARTIST

var playArtist = function(artistId){
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks',
        data: {
            country: 'US'
        },
        success: function(response) {
            if (playing === true){
                currentSong.pause();
                playing = false;
            }
            var audioObject = new Audio(response.tracks[0].preview_url)
            currentSong = audioObject;
            currentSong.play();
            playing = true;

            currentSong.onended = function(){
                currentSongD.play = false; 
                updateD3Graph(artistTree, currentNode) //update the pause icon to the play icon
            }
        }
    })
}

//PAUSE THE SONG CURRENTLY BEING PLAYED

var stopSong = function(){
    currentSong.pause();
    playing = false;
}