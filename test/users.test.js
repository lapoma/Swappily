require('dotenv').config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app/app');
const User = require('../app/models/user');
const bcrypt = require('bcrypt');

jest.mock('bcrypt');
jest.mock('../app/models/user');

// Tests for GET all users
describe('GET /api/v1/users', () => {
  let findSpy;

  beforeAll(() => {
    findSpy = jest.spyOn(User, 'find').mockImplementation((criteria) => {
      if (criteria?.username === 'john') {
        return Promise.resolve([
          {
            _id: '1',
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

  // Test: return all users
  test('should return 200 and a list of all users', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  // Test: filtered by username
  test('should return user filtered by username', async () => {
    const res = await request(app).get('/api/v1/users').query({ username: 'john' });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe('john');
  });
});

// Tests for GET current user info
describe('GET /api/v1/users/me', () => {
  let findByIdSpy;

  beforeAll(() => {
    findByIdSpy = jest.spyOn(User, 'findById').mockImplementation((criterias) => {
      return Promise.resolve({
        _id: '67a362ecb0ca5655003bf523',
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

  // Test: no token provided
  test('should return 401 with no token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.statusCode).toBe(401);
  });

  // Test: invalid token
  test('should return 403 with invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('token', 'invalidtoken');

    expect(res.statusCode).toBe(403);
  });

  // Generate valid JWT token
  const payload = {
    id: '67a362ecb0ca5655003bf523',
    username: 'jane',
  };
  const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 86400 });

  // Test: valid token returns 200
  test('should return 200', async () => {
    expect.assertions(1);
    const response = await request(app).get(`/api/v1/users/me?token=${token}`);
    expect(response.statusCode).toBe(200);
  });

  // Test: valid token returns correct user
  test('should return user data with a valid token ', async () => {
    expect.assertions(2);
    const response = await request(app).get(`/api/v1/users/me?token=${token}`);
    const user = response.body;
    expect(user).toBeDefined();
    expect(user.username).toBe('jane');
  });
});

// Tests to GET user by id
describe('GET /api/v1/users/:id', () => {
  let findByIdSpy;

  const existingUser = {
    _id: 'abcd1234',
    username: 'alice',
    email: 'alice@example.com',
    name: 'Alice',
    surname: 'Wonder',
    usertype: 'user',
    phone: '999',
    favorite: [],
    followed: [],
    n_followed: 0,
    followers: [],
    n_followers: 0,
    blocklist: [],
    n_exchanges: 0,
  };

  beforeAll(() => {
    findByIdSpy = jest.spyOn(User, 'findById');
  });

  afterAll(() => {
    findByIdSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: user exists
  test('should return 200 and user data when ID exists', async () => {
    // Successful database call returning the existing user
    findByIdSpy.mockResolvedValue(existingUser);

    const res = await request(app).get(`/api/v1/users/${existingUser._id}`);
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      self: `/api/v1/users/${existingUser._id}`,
      userId: existingUser.userId,
      username: existingUser.username,
      email: existingUser.email,
      name: existingUser.name,
      surname: existingUser.surname,
      usertype: existingUser.usertype,
      phone: existingUser.phone,
      favorite: existingUser.favorite,
      followed: existingUser.followed,
      n_followed: existingUser.n_followed,
      followers: existingUser.followers,
      n_followers: existingUser.n_followers,
      blocklist: existingUser.blocklist,
      n_exchanges: existingUser.n_exchanges,
    });

    // Verify the spy was called with the correct user ID
    expect(findByIdSpy).toHaveBeenCalledWith(existingUser._id);
  });

  // Test: user is not found
  test('should return 404 when ID does not exist', async () => {
    // Simulate no user found in the database
    findByIdSpy.mockResolvedValue(null);
    const res = await request(app).get('/api/v1/users/nonexistentid');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  // Test: database throws an error
  test('should return 500 on database error', async () => {
    findByIdSpy.mockRejectedValue(new Error('DB failure'));
    const res = await request(app).get(`/api/v1/users/${existingUser._id}`);
    expect(res.statusCode).toBe(500);
  });
});

// Tests for GET /:id/favorites, /:id/blocked, /:id/following, /:id/followers
describe('GET /api/v1/users/:id/(favorites|blocked|following|followers)', () => {
  const existingUserId = 'existingUserId';

  beforeAll(() => {
    // Mock User.findById per restituire un utente con le liste
    jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id === existingUserId) {
        return Promise.resolve({
          _id: id,
          favorite: ['fav1Id'],
          blocklist: ['blk1Id'],
          followed: ['fol1Id'],
          followers: ['fer1Id'],
        });
      }
      return Promise.resolve(null); // Utente non trovato
    });

    // Mock User.find per restituire utenti filtrati dagli ID
    jest.spyOn(User, 'find').mockImplementation((query) => {
      const ids = query.userId?.$in || [];
      const mapIdToUser = {
        fav1Id: { userId: 'fav1Id', username: 'fav1', name: 'Fav', surname: 'User', usertype: 'normal' },
        blk1Id: { userId: 'blk1Id', username: 'blk1', name: 'Blk', surname: 'User', usertype: 'normal' },
        fol1Id: { userId: 'fol1Id', username: 'fol1', name: 'Fol', surname: 'User', usertype: 'normal' },
        fer1Id: { userId: 'fer1Id', username: 'fer1', name: 'Fer', surname: 'User', usertype: 'normal' },
      };
      const results = ids.map(id => mapIdToUser[id]).filter(Boolean);

      return {
        select: jest.fn().mockResolvedValue(results),
      };
    });
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Ripristina i mock
  });

  test('should return 200 and list of favorites', async () => {
    const res = await request(app).get(`/api/v1/users/${existingUserId}/favorites`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('username', 'fav1');
  });

  test('should return 200 and list of blocked users', async () => {
    const res = await request(app).get(`/api/v1/users/${existingUserId}/blocked`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('username', 'blk1');
  });

  test('should return 200 and list of following users', async () => {
    const res = await request(app).get(`/api/v1/users/${existingUserId}/following`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('username', 'fol1');
  });

  test('should return 200 and list of followers', async () => {
    const res = await request(app).get(`/api/v1/users/${existingUserId}/followers`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('username', 'fer1');
  });

  test('should return 404 if user not found', async () => {
    jest.spyOn(User, 'findById').mockResolvedValueOnce(null);
  
    const res = await request(app).get(`/api/v1/users/nonexistentId/favorites`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });
  
  test('should return 500 on server error in findById', async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('DB error');
    });
  
    const res = await request(app).get(`/api/v1/users/${existingUserId}/favorites`);
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
  
  test('should return empty array if favorites list is empty or undefined', async () => {
    jest.spyOn(User, 'findById').mockResolvedValueOnce({ _id: existingUserId, favorite: [] });
    jest.spyOn(User, 'find').mockReturnValueOnce({ select: jest.fn().mockResolvedValueOnce([]) });
  
    const res = await request(app).get(`/api/v1/users/${existingUserId}/favorites`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });  
});

// Tests for creating a user
describe('POST /api/v1/users', () => {
  let findSpy;
  let saveSpy;
  let hashSpy;

  beforeAll(() => {
    // Mock User.find to simulate existing users
    findSpy = jest.spyOn(User, 'find').mockImplementation((criteria) => {
      if (criteria?.username === 'johnny') {
        return Promise.resolve([{ username: 'johnny' }]);
      }
      return Promise.resolve([]);
    });

    // Mock bcrypt.hash to simulate password hashing
    hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123!');

    // Mock save method to simulate successful user save
    saveSpy = jest.spyOn(User.prototype, 'save').mockImplementation(function () {
      return Promise.resolve({
        _id: '1234567890',
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

  // Test: missing required fields
  test('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/v1/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/userId.*required/i);
  });

  // Test: invalid email format
  test('should return 400 if email format is invalid', async () => {
    const res = await request(app).post('/api/v1/users').send({
      userId: '1',
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

  // Test: duplicate username
  test('should return 400 if username already exists', async () => {
    const res = await request(app).post('/api/v1/users').send({
      userId: '2',
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

  // Test: weak password
  test('should return 400 if password is weak', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: '3',
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

  // Test: invalid usertype
  test('should return 400 if usertype is invalid', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: '4',
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

  // Test: invalid numeric fields
  test('should return 400 if numeric fields are invalid', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: '5',
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

  // Test: successful user creation
  test('should return 201 and create user', async () => {
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: '1',
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

  // Test: duplicate email
  test('should return 400 if email already exists', async () => {
    // Mock User.findOne to simulate existing email
    const findOneSpy = jest.spyOn(User, 'findOne').mockImplementation((criteria) => {
      if (criteria?.email === 'duplicate@example.com') {
        return Promise.resolve({ email: 'duplicate@example.com' });
      }
      return Promise.resolve(null);
    });

    const res = await request(app).post('/api/v1/users').send({
      userId: '3',
      name: 'Alice',
      surname: 'Smith',
      username: 'uniqueUsername',
      email: 'duplicate@example.com',
      password: 'Password123!',
      usertype: 'user',
      n_followed: 0,
      n_followers: 0,
      n_exchanges: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email already in use/i);

    findOneSpy.mockRestore();
  });

  // Test: failure on save (internal server error)
  test('should return 500 if save fails', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn(); 

    saveSpy.mockImplementationOnce(() => Promise.reject(new Error('DB error')));
    findSpy.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/v1/users').send({
      userId: '6',
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

    console.error = originalConsoleError; 
  });
});

// Tests for updating a user
describe('PUT /api/v1/users/:id', () => {
  let findByIdSpy;
  let saveSpy;
  let compareSpy;
  let hashSpy;

  const existingUser = {
    _id: 'abcd1234',
    username: 'oldusername',
    email: 'old@example.com',
    name: 'Old',
    surname: 'User',
    password: 'oldHashedPassword',
    usertype: 'user',
    phone: '000',
    favorite: [],
    followed: [],
    n_followed: 0,
    followers: [],
    n_followers: 0,
    blocklist: [],
    n_exchanges: 0,
    save: jest.fn(),
  };

  beforeAll(() => {
    findByIdSpy = jest.spyOn(User, 'findById');
    compareSpy = jest.spyOn(bcrypt, 'compare');
    hashSpy = jest.spyOn(bcrypt, 'hash');
  });

  afterAll(() => {
    findByIdSpy.mockRestore();
    compareSpy.mockRestore();
    hashSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: successful user update
  test('should update user and return 200', async () => {
    findByIdSpy.mockResolvedValue(existingUser);
    compareSpy.mockResolvedValue(false);
    hashSpy.mockResolvedValue('newHashedPassword');

    existingUser.save.mockResolvedValue({
      ...existingUser,
      email: 'new@example.com',
      username: 'newusername',
      name: 'NewName',
      surname: 'NewSurname',
      password: 'newHashedPassword',
    });

    const res = await request(app).put(`/api/v1/users/${existingUser._id}`).send({
      email: 'new@example.com',
      username: 'newusername',
      name: 'NewName',
      surname: 'NewSurname',
      password: 'NewPassword123!',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'new@example.com');
    expect(res.body).toHaveProperty('username', 'newusername');
    expect(hashSpy).toHaveBeenCalledWith('NewPassword123!', 10);
    expect(existingUser.save).toHaveBeenCalled();
  });

  // Test: user not found
  test('should return 404 if user not found', async () => {
    findByIdSpy.mockResolvedValue(null);

    const res = await request(app).put('/api/v1/users/nonexistentid').send({
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test',
      surname: 'User',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  // Test: invalid email format
  test('should return 400 if email is invalid', async () => {
    findByIdSpy.mockResolvedValue(existingUser);

    const res = await request(app).put(`/api/v1/users/${existingUser._id}`).send({
      email: 'invalidemail',
      username: 'newusername',
      name: 'NewName',
      surname: 'NewSurname',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email.*valid/i);
  });

  // Test: password same as old
  test('should return 400 if password is same as old one', async () => {
    findByIdSpy.mockResolvedValue(existingUser);
    compareSpy.mockResolvedValue(true);

    const res = await request(app).put(`/api/v1/users/${existingUser._id}`).send({
      email: 'new@example.com',
      username: 'newusername',
      name: 'NewName',
      surname: 'NewSurname',
      password: 'SameOldPassword!',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Password MUST be different/i);
  });

  // Test: database error
  test('should return 500 on database error', async () => {
    findByIdSpy.mockRejectedValue(new Error('DB failure'));

    const res = await request(app).put(`/api/v1/users/${existingUser._id}`).send({
      email: 'new@example.com',
      username: 'newusername',
      name: 'NewName',
      surname: 'NewSurname',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error', 'Server error');
  });
});


// Tests for DELETE user by ID
describe('DELETE /api/v1/users/:id', () => {
  let findByIdSpy;

  const payload = {
    id: '67a362ecb0ca5655003bf523',
    username: 'jane',
  };
  const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 86400 });

  beforeAll(() => {
    findByIdSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id === payload.id) {
        return Promise.resolve({
          _id: payload.id,
          username: payload.username,
          remove: jest.fn().mockResolvedValue(true),
        });
      }
      return Promise.resolve(null);
    });
  });

  afterAll(() => {
    findByIdSpy.mockRestore();
  });

  // Test: no token
  test('should return 401 if no token is provided', async () => {
    const res = await request(app).delete(`/api/v1/users/${payload.id}`);
    expect(res.statusCode).toBe(401);
  });

  // Test: invalid token
  test('should return 403 if token is invalid', async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${payload.id}`)
      .set('token', 'invalidtoken');
    expect(res.statusCode).toBe(403);
  });

  // Test: user not found
  test('should return 404 if user does not exist', async () => {
    // Make findById resolve to null for “not found”
    findByIdSpy.mockResolvedValueOnce(null);

    const res = await request(app)
      .delete(`/api/v1/users/doesnotexist`)
      .set('token', token);
    expect(res.statusCode).toBe(404);
  });

  // Test: successful deletion
  test('should return 200 and delete the user', async () => {
    findByIdSpy.mockResolvedValueOnce({
      _id: payload.id,
      username: payload.username,
      remove: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .delete(`/api/v1/users/${payload.id}`)
      .set('token', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('jane');
  });
});
