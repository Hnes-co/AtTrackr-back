
const visitsRouter = require('express').Router();
const Visit = require('../models/visit');

visitsRouter.get('/', async (request, response) => {
  if(request.query.userId) {
    const visits = await Visit
      .find({ userId: request.query.userId });
    response.json(visits.map(visit => visit.toJSON()));
  }
  else {
    return response.status(401).json({ error: 'userId missing in request query' });
  }
});

visitsRouter.post('/', async (request, response) => {
  const body = request.body;
  const visit = new Visit({
    name: body.name,
    dateCreated: body.dateCreated,
    visited: body.visited === undefined ? false : body.visited,
    comments: body.comments,
    tags: body.tags,
    category: body.category,
    pictureLink: body.pictureLink,
    coordinates: body.coordinates,
    userId: body.userId
  });

  const savedVisit = await visit.save();
  response.json(savedVisit.toJSON());
});

visitsRouter.delete('/:id', async (request, response) => {
  await Visit.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

visitsRouter.put('/:id', (request, response, next) => {
  const body = request.body;
  const visit = {
    name: body.name,
    dateCreated: body.dateCreated,
    visited: body.visited === undefined ? false : body.visited,
    comments: body.comments,
    tags: body.tags,
    category: body.category,
    pictureLink: body.pictureLink,
    coordinates: body.coordinates,
    userId: body.userId
  };

  Visit.findByIdAndUpdate(request.params.id, visit)
    .then(updatedVisit => {
      response.json(updatedVisit.toJSON());
    })
    .catch(error => next(error));
});

module.exports = visitsRouter;
