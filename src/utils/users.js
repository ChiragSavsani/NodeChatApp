const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {

    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username || !room) {
        return {
            error: 'User name and room are required.'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate User name
    if (existingUser) {
        return {
            error: 'Username is already available in this room!'
        }
    }

    //Store User
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}

// addUser({
//     id: 26,
//     userName: 'Chirag',
//     room: 'Family'
// })
// addUser({
//     id: 11,
//     userName: 'Trusha',
//     room: 'Family'
// })

// addUser({
//     id: 12,
//     userName: 'Jainik',
//     room: 'Friends'
// })

// addUser({
//     id: 23,
//     userName: 'Dhaval',
//     room: 'Friends'
// })


// console.log(users)
// console.log(getUser(26))
// const userList = getUserInRoom('Family')
// console.log(userList)

//const removedUser = removeUser(26)
//console.log(removedUser)
//console.log(users)
