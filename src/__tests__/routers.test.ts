const axios = require('axios');

test('Testando chamada de API', async () => {
  const response = await axios.get('http://localhost:4000/');
  expect(response.status).toBe(200);
  expect(response.data).toBe('Bem-vindo!');
});

test('Testando chamada de API GET Eventos', async () => {
  const response = await axios.get('http://localhost:4000/api/events');

  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
});

test('Testando chamada de API GET EVento', async () => {
  const response = await axios.get('http://localhost:4000/api/events/1');

  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
}
);

test('Testando chamada de API POST Evento', async () => {
  const response = await axios.post('http://localhost:4000/api/events', {
    name: "Evento de teste",
    description: "Evento de teste",
    location: "Evento de teste",
    date: "2021-10-10",
    time: "10:00",
    userId: 1
  });

  expect(response.status).toBe(201);
  expect(response.data).toBeDefined();
});

test('Testando chamada de API Login', async () => {
  const response = await axios.post('http://localhost:4000/api/login', {
    Email: "teste@teste.com",
    Password: "teste"
  });

  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
});

test('Testando chamada de API Validacao Certificados', async () => {
  // Não vai validar  
  try {
    const response = await axios.post('http://localhost:4000/api/certificates/validate', {
      MD5: "123456789"
    });
  } catch (error: any) {
    expect(error.response.status).toBe(404);
    expect(error.response.data).toBeDefined();
  }
});

test('Testando chamada de API GET Certificados', async () => {
  const response = await axios.get('http://localhost:4000/api/certificates/1');

  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
});