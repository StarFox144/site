const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

const bookings = [];

// Структура даних для User
const userService = 'http://localhost:9080/users/';

// Структура даних для Tour
const tourService = 'http://localhost:9081/tours/';

// Функція для обробки GET запиту для бронювання
app.get('/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === bookingId);

  if (booking) {
    res.status(200).json(booking);
  } else {
    res.status(404).send('Booking not found');
  }
});

// Функція для обробки POST запиту для створення нового бронювання
app.post('/bookings', async (req, res) => {
  const booking = req.body;

  try {
    // Отримати дані користувача з сервісу користувачів
    const userResponse = await axios.get(`${userService}${booking.user.id}`);
    booking.user = userResponse.data;

    // Отримати дані туру з сервісу турів
    const tourResponse = await axios.get(`${tourService}${booking.tour.id}`);
    booking.tour = tourResponse.data;

    booking.id = bookings.length + 1;
    booking.paymentStatus = 'pending';
    bookings.push(booking);
    res.status(201).json(booking);
  } catch (error) {
    if (error.response.status === 404) {
      res.status(400).send(error.response.data);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

const port = 9082;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
