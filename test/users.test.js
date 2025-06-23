require('dotenv').config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app/app');
const User = require('../app/models/user');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');
jest.mock('../app/models/user');


describe('POST /api/v1/users', () => {
  let findSpy;
  let saveSpy;
  let hashSpy;

  beforeAll(() => {
    findSpy = jest.spyOn(User, 'find').mockImplementation((criteria) => {
      if (criteria?.username === 'johnny') {
        return Promise.resolve([{ username: 'johnny' }]);
      }
      return Promise.resolve([]);
    });

    hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123!');

    saveSpy = jest.spyOn(User.prototype, 'save').mockImplementation(function () {
      return Promise.resolve({
        _id: '1234567890',
        userId: this.userId,
        username: this.username,
        email: this.email,
        name: this.name,
        surname: this.surname,
        usertype: this.usertype,
        phone: this.phone || '',
        favorite: this.favorite || [],
        followed: this.followed || [],
        n_followed: this.n_followed || 0,
        followers: this.followers || [],
        n_followers: this.n_followers || 0,
        blocklist: this.blocklist || [],
        n_exchanges: this.n_exchanges || 0,
      });
    });
  });

  afterAll(() => {
    findSpy.mockRestore();
    saveSpy.mockRestore();
    hashSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/v1/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/userId.*required/i);
  });

  test('should return 400 if email format is invalid', async () => {
    const res = await request(app).post('/api/v1/users').send({
      userId: 1,
      name: 'John',
      surname: 'Doe',
      username: 'johnny',
      email: 'invalid-email',
      password: 'Password123!',
      usertype: 'user',
      n_followed: 0,
      n_followers: 0,
      n_exchanges: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  test('should return 400 if username already exists', async () => {
    const res = await request(app).post('/api/v1/users').send({
      userId: 2,
      name: 'John',
      surname: 'Doe',
      username: 'johnny',
      email: 'john@example.com',
      password: 'Password123!',
      usertype: 'user',
      n_followed: 0,
      n_followers: 0,
      n_exchanges: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/username.*3-20 chars/i);
  });

  test('should return 400 if password is weak', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: 3,
      name: 'John',
      surname: 'Doe',
      username: 'johnny123',
      email: 'john@example.com',
      password: 'weakpass',
      usertype: 'user',
      n_followed: 0,
      n_followers: 0,
      n_exchanges: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/password.*8\+ chars/i);
  });

  test('should return 400 if usertype is invalid', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: 4,
      name: 'John',
      surname: 'Doe',
      username: 'johnny456',
      email: 'john@example.com',
      password: 'Password123!',
      usertype: 'admin',
      n_followed: 0,
      n_followers: 0,
      n_exchanges: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/usertype.*(user|operator)/i);
  });

  test('should return 400 if numeric fields are invalid', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: 5,
      name: 'John',
      surname: 'Doe',
      username: 'johnny789',
      email: 'john@example.com',
      password: 'Password123!',
      usertype: 'user',
      n_followed: 'zero',
      n_followers: 'none',
      n_exchanges: 'many',
    });

    expect(res.statusCode).toBe(400);
  });

  test('should create user and return 201', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: 1,
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123!',
      usertype: 'user',
      phone: '1234567890',
      favorite: [],
      followed: [],
      n_followed: 0,
      followers: [],
      n_followers: 0,
      blocklist: [],
      n_exchanges: 0,
    });

    expect(res.statusCode).toBe(201);
  });

  test('should return 500 if save fails', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn(); // silenzia l'errore
  
    saveSpy.mockImplementationOnce(() => Promise.reject(new Error('DB error')));
    findSpy.mockResolvedValueOnce([]);
  
    const res = await request(app).post('/api/v1/users').send({
      userId: 6,
      name: 'John',
      surname: 'Doe',
      username: 'johnerror',
      email: 'johnerror@example.com',
      password: 'Password123!',
      usertype: 'user',
      n_followed: 0,
      n_followers: 0,
      n_exchanges: 0,
    });
  
    expect(res.statusCode).toBe(500);
  
    console.error = originalConsoleError; // ripristina
  });
});

describe('GET /api/v1/users', () => {
  let findSpy;

  beforeAll(() => {
    findSpy = jest.spyOn(User, 'find').mockImplementation((criteria) => {
      if (criteria?.username === 'john') {
        return Promise.resolve([
          {
            _id: '1',
            userId: 1,
            username: 'john',
            email: 'john@example.com',
            name: 'John',
            surname: 'Doe',
            usertype: 'user',
            phone: '123',
            favorite: [],
            followed: [],
            n_followed: 0,
            followers: [],
            n_followers: 0,
            blocklist: [],
            n_exchanges: 0,
          },
        ]);
      } else if (!criteria || Object.keys(criteria).length === 0) {
        return Promise.resolve([
          {
            _id: '1',
            userId: 1,
            username: 'john',
            email: 'john@example.com',
            name: 'John',
            surname: 'Doe',
            usertype: 'user',
            phone: '123',
            favorite: [],
            followed: [],
            n_followed: 0,
            followers: [],
            n_followers: 0,
            blocklist: [],
            n_exchanges: 0,
          },
          {
            _id: '2',
            userId: 2,
            username: 'jane',
            email: 'jane@example.com',
            name: 'Jane',
            surname: 'Smith',
            usertype: 'operator',
            phone: '456',
            favorite: [],
            followed: [],
            n_followed: 0,
            followers: [],
            n_followers: 0,
            blocklist: [],
            n_exchanges: 0,
          },
        ]);
      }
      return Promise.resolve([]);
    });
  });

  afterAll(() => {
    findSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return list of all users', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('should return list filtered by username', async () => {
    const res = await request(app).get('/api/v1/users').query({ username: 'john' });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe('john');
  });
});

describe('GET /api/v1/users/me', () => {
    let findByIdSpy;
  
    beforeAll(() => {
      findByIdSpy = jest.spyOn(User, 'findById').mockImplementation((criterias) => {
          return Promise.resolve({
            _id: '67a362ecb0ca5655003bf523',
            userId: 2,
            username: 'jane',
            email: 'jane@example.com',
            name: 'Jane',
            surname: 'Smith',
            usertype: 'user',
            phone: '456',
            favorite: [],
            followed: [],
            n_followed: 0,
            followers: [],
            n_followers: 0,
            blocklist: [],
            n_exchanges: 0,
          });
      });
    });
  
    afterAll(async () => {
      findByIdSpy.mockRestore();
    });
  
    test('GET /api/v1/users/me with no token should return 401', async () => {
        const res = await request(app).get('/api/v1/users/me');
        expect(res.statusCode).toBe(401);
    });
  
    test('GET /api/v1/users/me with invalid token should return 403', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('token', 'invalidtoken');
  
      expect(res.statusCode).toBe(403);
    });

    var payload = {
        id: "67a362ecb0ca5655003bf523",
        username: "jane"
      }

    var token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 86400 });

    test('GET /api/v1/users/me?token=<valid> should return 200', async () => {
        expect.assertions(1);
        const response = await request(app).get(`/api/v1/users/me?token=${token}`);
        expect(response.statusCode).toBe(200);
      });

    test('GET /api/v1/users/me?token=<valid> with valid token should return user data', async () => {
        expect.assertions(2);
        const response = await request(app).get(`/api/v1/users/me?token=${token}`);
        const user = response.body;
        expect(user).toBeDefined();
        expect(user.username).toBe("jane");
    });
  });