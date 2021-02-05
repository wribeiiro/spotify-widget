window.$ = window.jQuery = require('jquery')

const querystring = require('querystring')
const query = querystring.parse(global.location.search) 
const accessToken = JSON.parse(query['?access_token'])

$(document).ready(function () {
    let firstExecution = false

    if (firstExecution == false) {
        loopCurrentSong(accessToken)
        firstExecution = true
    }

    setInterval(() => {
        loopCurrentSong(accessToken)
    }, 5000)
})

function loopCurrentSong(token) {
    
    const setSong = (data) => {
        $("#marquee").html(`<span>&#x25B6; ${data.item.artists[0].name} - ${data.item.name}</span>`)
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
        }
    })
}