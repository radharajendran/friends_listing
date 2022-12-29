const db = require('./database');
const http = require('../shared/http');

/**
 * Method used to connect with friends
 * @param {*} data
 * @returns 
 */
const addFriend = async (req, res) => {
    let {
        userId,
        friendId
    } = req.params;
    
    let query = `INSERT INTO friends (userid, friendid) VALUES (${userId}, ${friendId})`;

    db.run(query).then((results) => {
        http.send(req, res, { status: 'success', message: 'Friend connection made successfully', users: results });
      }).catch((err) => {
        http.send(req, res, err);
    });
}

/**
 * Method used to remove friend connection
 * @param {*} data 
 * @returns 
 */
const removeFriend = async (req, res) => {
    let {
        userId,
        friendId
    } = req.params;

    let sqlQuery = `DELETE FROM friends WHERE userId = ${userId} AND friendId = ${friendId}`;

    db.run(sqlQuery).then((results) => {
        http.send(req, res, { status: 'success', message: 'Friend connection removed successfully', users: results });
      }).catch((err) => {
        http.send(req, res, err);
    });

}

module.exports = {
    addFriend,
    removeFriend
}