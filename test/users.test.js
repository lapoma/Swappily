const request = require('supertest');
const app = require('../app/app');
const User = require('../app/models/user');

jest.mock('../app/models/user');

afterEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/v1/users', () => {
  test('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/api/v1/users').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/name/i); // Adatta al messaggio reale
  });

  test('should return 400 if email format is invalid', async () => {
    User.find.mockResolvedValue([]); // username non esiste

    const response = await request(app).post('/api/v1/users').send({
      name: 'John',
      surname: 'Doe',
      username: 'johnny',
      email: 'invalid-email', // email errata
      password: 'Password123!'
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/email/i);
  });

  test('should return 201 and create user', async () => {
    User.find.mockResolvedValue([]); // username non esiste

    const saveMock = jest.fn().mockResolvedValue({
      _id: '1234567890',
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      email: 'john@example.com'
    });

    User.mockImplementation(function () {
      return { save: saveMock };
    });

    const response = await request(app).post('/api/v1/users').send({
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123!'
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('johndoe');
    expect(saveMock).toHaveBeenCalled();
  });
});

describe('GET /api/v1/users', () => {
  test('should return list of users', async () => {
    User.find.mockResolvedValue([
      {
        _id: '1',
        username: 'john',
        email: 'john@example.com',
        name: 'John',
        surname: 'Doe'
      },
      {
        _id: '2',
        username: 'jane',
        email: 'jane@example.com',
        name: 'Jane',
        surname: 'Smith'
      }
    ]);

    const response = await request(app).get('/api/v1/users');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].username).toBe('john');
    expect(response.body[1].username).toBe('jane');
  }, 10000); // timeout esteso
});
