module.exports = (entity) =>
  (entity.id = entity._id.toString()) && delete entity._id;
