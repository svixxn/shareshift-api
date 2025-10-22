db = db.getSiblingDB('shareshift');
db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [{ role: 'readWrite', db: 'shareshift' }],
});
