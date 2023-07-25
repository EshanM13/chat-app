const users = [];

function userJoin(id, username, room){
    const user = {id, username, room};
    users.push(user); 

    return user;
}

function findCurrentUser(id){
    return users.find(user => user.id === id);
}

function leftUser(id){
    const index = users.findIndex(user => user.id === id);
    if (id != -1){
        return users.splice(index,1)[0];
    }
};

function getRoomUsers(room){
    return users.filter(user => user.room === room);

}

module.exports = {userJoin, findCurrentUser , leftUser , getRoomUsers } ;

