const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFromButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const slideBarTemplate = document.querySelector('#slidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    //New message element
    const $newMessages = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessages)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessages.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    //How far I have scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

    console.log($newMessages);
    console.log(newMessageStyles);
    console.log(newMessageMargin);
    console.log(newMessageHeight);
}

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(slideBarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => { //Hear e means event
    e.preventDefault()
    //const msg = messageDoc.value

    //Disable
    $messageFromButton.setAttribute('disabled', 'disabled')
    const msg = e.target.elements.message.value
    socket.emit('message_from_client', msg, (error) => {
        //Enable
        $messageFromButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('The message was delivered!')
    })
})

$locationButton.addEventListener('click', (e) => { //Hear e means event

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported in your browser.')
    }
    //Disable
    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        $locationButton.removeAttribute('disabled')
        //socket.emit('sendLocation', position.coords.latitude, position.coords.longitude)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {

    if (error) {
        alert(error)
        location.href = '/'
    }
})

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated...', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })