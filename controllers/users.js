const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const body = request.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds);
  const user = new User({
    username: body.username,
    name: body.name,
    country: "",
    profilePic: "",
    passwordHash
  });

  const savedUser = await user.save();
  response.json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const user = await User.findOne({ username: request.query.username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(request.query.passwordHash, user.passwordHash);

  if(!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  response
    .status(200)
    .send(user);
});

usersRouter.put('/', async (request, response) => {
  const body = request.body;
  const user = await User.findOne({ username: body.username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.passwordHash, user.passwordHash);

  if(!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const updatedUser = {
    name: body.name,
    country: body.country,
    profilePic: body.profilePic
  };

  User.findOneAndUpdate({ username: body.username }, updatedUser, { new: true })
    .then(updatedUser => {
      response.json(updatedUser.toJSON());
    })
    .catch(error => next(error));
});

module.exports = usersRouter;