const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());

const FILE_PATH = './users.json';

// Функция для чтения пользователей из файла
function readUsers() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    return [];
  }
}

// Функция для записи пользователей в файл
function writeUsers(users) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
}

// Получение списка пользователей
app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

// Получение пользователя по ID
app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(user => user.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Пользователь не найден' });
  }
});

// Создание нового пользователя
app.post('/users', (req, res) => {
  const users = readUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: req.body.name,
    age: req.body.age,
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// Обновление существующего пользователя
app.put('/users/:id', (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    writeUsers(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'Пользователь не найден' });
  }
});

// Удаление пользователя
app.delete('/users/:id', (req, res) => {
  const users = readUsers();
  const updatedUsers = users.filter(user => user.id !== parseInt(req.params.id));

  if (updatedUsers.length < users.length) {
    writeUsers(updatedUsers);
    res.json({ message: 'Пользователь удален' });
  } else {
    res.status(404).json({ message: 'Пользователь не найден' });
  }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
