window.$ = window.jQuery = require('jquery')
const myConsole = require('console')

const querystring = require('querystring')
const query = querystring.parse(global.location.search) 
const accessToken = JSON.parse(query['?access_token'])

loopCurrentSong(accessToken)

function loopCurrentSong(token) {
    
    const setSong = (data) => {
        const song = `<span> 
            🎧 Playing now:
            <img src="${data.item.album.images[0].url}" width="30" height="30">
            ${data.item.artists[0].name} - ${data.item.name}
        </span>`

        $("#marquee").html(song)
        myConsole.log(`${(new Date).toLocaleDateString()} ${(new Date).toLocaleTimeString()} ${song}`)
    }

    $.ajax({
        url: "https://api.spotify.com/v1/me/player",
        type: "GET",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        },
        success: (data) => {
            if (!data) {
                return
            }

            setSong(data)
        },
        complete: () => {
            setTimeout(() => loopCurrentSong(accessToken), 4000)
        }
    })
}