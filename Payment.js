const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());

const payments = [];

// Структура даних для Booking
const bookingService = 'http://localhost:9082/bookings/';

// Функція для обробки GET запиту для платежу
app.get('/payments/:id', (req, res) => {
  const paymentId = parseInt(req.params.id);
  const payment = payments.find(p => p.id === paymentId);

  if (payment) {
    res.status(200).json(payment);
  } else {
    res.status(404).send('Payment not found');
  }
});

// Функція для обробки POST запиту для створення нового платежу
app.post('/payments', async (req, res) => {
  const payment = req.body;

  try {
    // Отримати інформацію про бронювання з сервісу бронювань
    const bookingResponse = await axios.get(`${bookingService}${payment.booking.id}`);
    payment.booking = bookingResponse.data;
    payment.amount = payment.booking.price;
    payment.status = 'pending';

    payment.id = payments.length + 1;
    payments.push(payment);
    res.status(201).json(payment);
  } catch (error) {
    if (error.response.status === 404) {
      res.status(400).send(error.response.data);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

const port = 9083;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
