const express = require('express');
const app = express();
app.use(express.json());

const users = [];

// Функція для обробки GET запиту для конкретного користувача
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Функція для обробки POST запиту для створення нового користувача
app.post('/users', (req, res) => {
  const user = req.body;
  user.id = users.length + 1;
  users.push(user);
  res.status(201).json(user);
});

const port = 9080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
