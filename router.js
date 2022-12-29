const express = require('express');

const user = require('./data/user');
const friend = require('./data/friend');

const router = express.Router();

router.get('/search/:userId/:query', user.bfs_search);

router.get('/friend/:userId/:friendId', friend.addFriend);

router.get('/unfriend/:userId/:friendId', friend.removeFriend);


module.exports = router;