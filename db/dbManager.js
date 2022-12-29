const dbUtil = require('../data/database');

const initDatabase = async () => {

    await dbUtil.run('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(32));');

    await dbUtil.run('CREATE TABLE Friends (id INTEGER PRIMARY KEY AUTOINCREMENT, userId int, friendId int);');

    const users = [];
    const names = ['foo', 'bar', 'baz'];
    for (i = 0; i < 27000; ++i) {
    let n = i;
    let name = '';
    for (j = 0; j < 3; ++j) {
        name += names[n % 3];
        n = Math.floor(n / 3);
        name += n % 10;
        n = Math.floor(n / 10);
    }
    users.push(name);
    }
    const friends = users.map(() => []);
    for (i = 0; i < friends.length; ++i) {
    const n = 10 + Math.floor(90 * Math.random());
    const list = [...Array(n)].map(() => Math.floor(friends.length * Math.random()));
    list.forEach((j) => {
        if (i === j) {
        return;
        }
        if (friends[i].indexOf(j) >= 0 || friends[j].indexOf(i) >= 0) {
        return;
        }
        friends[i].push(j);
        friends[j].push(i);
    });
    }
    console.log("Init Users Table...");
    await Promise.all(users.map((un) => dbUtil.run(`INSERT INTO Users (name) VALUES ('${un}');`)));
    console.log("Init Friends Table...");
    await Promise.all(friends.map((list, i) => {
    Promise.all(list.map((j) => dbUtil.run(`INSERT INTO Friends (userId, friendId) VALUES (${i + 1}, ${j + 1});`)));
    }));

    //Creating index for friends table
    let IndexQuery = `CREATE INDEX "idx_friends_userid" ON "Friends" ("userId")`
    dbUtil.run(IndexQuery).then((results) =>{   
        console.log("Index created for userId column in Friends Table...");
    }).catch((err) => {
        console.log("Error in index creation for userId column in Friends Table...");
    });

    console.log("Ready.");
}
console.log('hilll')
if (process.argv[2] === 'init_data') 
    return initDatabase();
