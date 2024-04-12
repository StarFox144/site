const express = require('express');
const app = express();
app.use(express.json());

const tours = [];

// Function to handle GET request for a specific tour
app.get('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  const tour = tours.find(t => t.id === tourId);

  if (tour) {
    res.status(200).json(tour);
  } else {
    res.status(404).send('Tour not found');
  }
});

// Function to handle POST request for creating a new tour
app.post('/tours', (req, res) => {
  const tour = req.body;
  tour.id = tours.length + 1;
  tours.push(tour);
  res.status(201).json(tour);
});

const port = 9081;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
