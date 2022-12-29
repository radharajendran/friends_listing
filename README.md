# friends_listing


Below changes are made in existing code base:

- Developed seperate DB util to create tables and default datas

  To create table and default data , please use below npm command
  
  - npm run init_db 

  - DB config available cfg --> config.json
  
- Settings for DB connection and Pagination

- Added friend and unFriend APIs

- Breath First Search(BFS) Algorithm implemented in sqlite Queries to Identify the different Hierarchy of friend lists

    - Finding the Hierarchy of the friends with help of recursive queries in Sqlite database.

- Simple Pagination mechanism Implemented to avoid large search results and DOM rendering

- Changes in Search Event Handling

- Added util scripts to handle res and err object and logger



