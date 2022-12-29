const db = require('./database');
const http = require('../shared/http');
const cfg = require('../cfg/config.json');

const search = async (req, res) => {
  const query = req.params.query;
  const userId = parseInt(req.params.userId);

  db.all(`SELECT id, name, id in (SELECT friendId from Friends where userId = ${userId}) as connection from Users where name LIKE '${query}%' LIMIT 20;`).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true,
      users: results
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}

const bfs_search = async(req, res) => {
  const query = req.params.query;
  const userId = parseInt(req.params.userId);
  let {
    pageNo
  } = req.query;

  let sqlQuery = `
      with recursive
      bfs_tree(bfs_id, visited, connection) AS (
          SELECT ${userId}, '/' || ${userId} || '/', 0
          UNION ALL
          SELECT friendid, visited || friendid || '/', connection + 1
          FROM Friends, bfs_tree
          WHERE userid = bfs_id AND instr(visited, '/' || friendid || '/') == 0
          AND bfs_tree.connection <= ${cfg.connectionLevel}
          ORDER BY 3 asc
      )
      SELECT 
          DISTINCT(bfs_tree.bfs_id), 
          visited, 
          connection, 
          users.name, 
          (SELECT COUNT(1) FROM bfs_tree) AS total_records, 
          '${cfg.pageSize}' AS page_size  
      FROM bfs_tree
      INNER JOIN users ON users.id = bfs_tree.bfs_id
      UNION
      SELECT 
          id, 
          null AS visited, 
          id IN (SELECT friendId FROM Friends WHERE userId = ${userId} ) AS connection, 
          name, 
          1, 
          '${cfg.pageSize}' AS page_size 
      FROM
          Users 
      WHERE name LIKE '${query}%' LIMIT 20 OFFSET ${((pageNo - 1) * cfg.pageSize)};
    `;

    db.all(sqlQuery).then((results) => {
      http.send(req, res, { success: true, users: results });
    }).catch((err) => {
      http.send(req, res, err);
    });
  }

module.exports = {
  search,
  bfs_search
}