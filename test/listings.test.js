require('dotenv').config();

const request = require('supertest'); //https://www.npmjs.com/package/supertest
const jwt = require('jsonwebtoken');
const app = require('../app/app');
const Listing = require('../app/models/listing');
const User = require('../app/models/user'); // Assuming you have a User model
const bcrypt = require('bcrypt');
//const { afterEach, describe, default: test } = require('node:test');


jest.mock('bcrypt');
jest.mock('../app/models/listing');
jest.mock('../app/models/user');

describe('POST /api/v1/listings', () =>{
  //https://jestjs.io/docs/mock-functions
  let findSpy;
  let hashSpy;
  let saveSpy;
  let existsSpy;
  let findUserByIdSpy;

  const payload = {
    id: '12345',
    username: 'jhonny',
  };

  const token = jwt.sign(payload, process.env.SUPER_SECRET, {expiresIn: 86400});

  beforeAll(async ()=>{
    findSpy = jest.spyOn(Listing, 'find').mockImplementation((criteria) =>{
      if(criteria?.title ==='cat'){
        return Promise.resolve([{ id: '01', title: 'cat'}]);
      }
      return Promise.resolve([]);
    });

    // Mock User.exists to simulate user existence
    existsSpy = jest.spyOn(User, 'exists').mockImplementation((id) => {
      // Simulate valid ObjectId check
      if(id === '12345'){
        return Promise.resolve([{ id: '12345'}]);
      }
    });

    // Mock bcrypt.hash to return a fixed value
    hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123!');

    //Mock save method to simulate successful listing creation
    saveSpy = jest.spyOn(Listing.prototype, 'save').mockImplementation(function(){
      return Promise.resolve({
        id: '01',
        title: 'cat',
        username: 'jhonny',
        userId: '12345',
        description: 'A cute cat',
        status: 'Very good'
      })
    });

    //Mock User.findById
    findUserByIdSpy = jest.spyOn(User, 'findById').mockImplementation((id) =>{
      if(id === payload.id){
        return Promise.resolve({
          id:payload.id,
          username: payload.username,
          remove: jest.fn().mockResolvedValue(true)
        })
      }
    })
  });
  
  afterAll( async () => {
    //restore all mocks
    findSpy.mockRestore();
    hashSpy.mockRestore();
    saveSpy.mockRestore();
    existsSpy.mockRestore();
    findUserByIdSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  test('should create a new listing', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        id: '01',
        title: 'cat',
        username: 'jhonny',
        userId: '12345',
        description: 'A cute cat',
        status: 'Very good'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('cat');

  });

  //test: missing required fields
  test('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({ title: 'cat' });
      expect(res.statusCode).toBe(400);
  });

  //test: required fields are not correct
  test('should return 400 if Status is not correctly formatted', async ()=>{
    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        title: 'cat',
        username: 'jhonny',
        userId: '12345',
        description: 'A cute cat',
        status: 'Inexistent status'});
        expect(res.statusCode).toBe(400);
  });

  test('should return 400 if description is not the correct length', async() =>{
    const res= await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        title: 'cat',
        username: 'jhonny',
        description: 'x',
        status: 'Very Good'})
        expect(res.statusCode).toBe(400);
  })

  //test: invalid userId
  test('should return 400 if userId is not a valid Id', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        title: 'cat',
        username: 'jhonny',
        userId: 'invalidUserId',
        description: 'A cute cat',
        status: 'Very good'
      });

    expect(res.statusCode).toBe(400);
  });

  //test: the user is not authenticate (no token)
  test('should return 401 if no token is provided', async() =>{
    const res = await request(app)
    .post('/api/v1/listings')
    .send({
      title: 'cat',
      username: 'jhonny',
      userId: '12345',
      description: 'A cute cat',
      status: 'Very good'
    });
    expect(res.statusCode).toBe(401);
  })
 
  //test: failed to save listing
  test('should return 500 if there is an error saving the listing', async () => {
    saveSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        title: 'cat',
        username: 'jhonny',
        userId: '12345',
        description: 'A cute cat',
        status: 'Very good'
      });
    expect(res.statusCode).toBe(500);
  });
})

describe('GET /api/v1/listings', () =>{
  //https://jestjs.io/docs/mock-functions
  let findSpy;
  let findUserSpy;

  beforeAll( async () =>{
    //mock Listing.find() function
    findSpy = jest.spyOn(Listing, 'find').mockImplementation((criteria) =>{
      if(criteria?.title === 'cat'){
        return Promise.resolve([{
          id: '01',
          title: 'cat',
          username: 'jhonny',
          userId: '12345',
          description: 'A cute cat',
          status: 'Very good'
        }]);
      }else if(!criteria || Object.keys(criteria).length === 0){
        return Promise.resolve([
          {
            _id: '01',
            title: 'cat',
            username: 'jhonny',
            userId: '12345',
            description: 'A cute cat',
            status: 'Very good'
          },
          {
            _id: '02',
            title: 'backpack',
            username: 'jane',
            userId: '2222',
            description: 'a green backpack',
            status: 'Ok'
          },
          {
            _id: '03',
            title: 'tennis racket',
            username: 'bob',
            userId: '3333',
            description: 'a never used tennis racket',
            status: 'As new'
          }
        ])
      }else if(criteria.status === 'Ok'){
        return Promise.resolve([{
          _id: '02',
            title: 'backpack',
            username: 'jane',
            userId: '2222',
            description: 'a green backpack',
            status: 'Ok'
        }])
      }
      return Promise.resolve([]);
    });

    findUserSpy = jest.spyOn(User, 'find').mockImplementation((criteria) =>{
      if(criteria.userId === '12345'){
        return Promise.resolve([{
          _id: '12345',
          username: 'jane',
          favorite: ['03'],
          following: ['2222']
        }])
      }
    })
  });

  afterAll(async() =>{
    //restore all mocks
    findSpy.mockRestore();
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

    //test: return all the listings
  test('should return 200 and all the listings', async() =>{
    const res= request(app)
      .get('/api/v1/listings');
    expect((await res).statusCode).toBe(200);
  });

  //test: return the listing filtered by title
  test('should return 200 and the listings fitting the criteria',async() =>{
    const res = await request(app)
    .get('/api/v1/listings')
    .query({
      title: 'cat'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe('cat');
  });

  //test: return the listing filtered by status
  test('should return 200 and the listings filtered by status', async() =>{
    const res = await request(app)
    .get('/api/v1/listings')
    .query({
      status: 'Ok'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].status).toBe('Ok');
  });
  //tets: return the listing filtered by title and status
  test('should return 200 and the listings filtered by title and status', async() =>{
    const res = await request(app)
    .get('/api/v1/listings')
    .query({
      title: 'cat',
      status: 'Very good'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe('cat');
    expect(res.body[0].status).toBe('Very good');
  });

  test('should return 500 if there is a database error', async () =>{
    findSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .get('/api/v1/listings');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
})

describe('GET /api/v1/listings/:userId/favorites', () => {
  let findByIdSpy;
  let findSpy;

  beforeAll(() => {
    findByIdSpy = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id === '12345') {
        return Promise.resolve({
          _id: '12345',
          username: 'jane',
          favorite: ['01', '03']
        });
      }
      return Promise.resolve(null);
    });

    findSpy = jest.spyOn(Listing, 'find').mockImplementation((criteria) => {
      if (criteria._id && criteria._id.$in) {
        const listings = [
          { _id: '01', title: 'cat', self: '/api/v1/listings/01' },
          { _id: '03', title: 'tennis racket', self: '/api/v1/listings/03' }
        ];
        return Promise.resolve(listings.filter(listing => criteria._id.$in.includes(listing._id)));
      }
      return Promise.resolve([]);
    });
  });

  afterAll(() => {
    findByIdSpy.mockRestore();
    findSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 and the user\'s favorite listings', async () => {
    const res = await request(app)
      .get('/api/v1/listings/12345/favorites');

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('self');
    expect(res.body[0].self).toMatch(/\/api\/v1\/listings\/\w+/);
  });

  test('should return 404 if user not found', async () => {
    const res = await request(app)
      .get('/api/v1/listings/invalidUserId/favorites');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  test('should return 500 if there is a database error', async () =>{
    findByIdSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .get('/api/v1/listings/12345/favorites');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});

describe('GET /api/v1/listings/{listingId}', () => {
  let findByIdSpy;

  beforeAll(() => {
    findByIdSpy = jest.spyOn(Listing, 'findById').mockImplementation((id) => {
      if (id === '01') {
        return Promise.resolve({
          _id: '01',
          title: 'cat',
          username: 'jhonny',
          userId: '12345',
          description: 'A cute cat',
          status: 'Very good'
        });
      }
      return Promise.resolve(null);
    });
  });

  afterAll(() => {
    findByIdSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the listing by ID', async () => {
    const res = await request(app)
      .get('/api/v1/listings/01');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'cat');
  });

  test('should return 404 if listing not found', async () => {
    const res = await request(app)
      .get('/api/v1/listings/invalidListingId');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Listing not found');
  });

  test('should return 500 if there is a database error', async () => {
    findByIdSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .get('/api/v1/listings/01');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
})

describe('DELETE  /api/v1/listings/{listingId}', () =>{
  let findByIdSpy;
  let findByIdAndDeleteSpy;

  const payload = {
      id: '2222',
      username: 'jane',
  };
  const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 86400 });
  
  beforeAll(() =>{
    findByIdSpy = jest.spyOn(Listing, 'findById').mockImplementation((id) =>{
      if (id === '01') {
        return Promise.resolve({
          _id: '01',
          title: 'cat',
          username: 'jhonny',
          userId: '12345',
          description: 'A cute cat',
          status: 'Very good'
        });
      }else if(id ==='02'){
        return Promise.resolve({
           _id: '02',
            title: 'backpack',
            username: 'jane',
            userId: '2222',
            description: 'a green backpack',
            status: 'Ok'
        });
      }
      return Promise.resolve(null);
    })
    findByIdAndDeleteSpy = jest.spyOn(Listing, 'findByIdAndDelete').mockImplementation((id) => {
      if (id === '01') {
        return Promise.resolve({
          _id: '01',
          title: 'cat',
          username: 'jhonny',
          userId: '12345',
          description: 'A cute cat',
          status: 'Very good'
        });
      }else if(id ==='02'){
        return Promise.resolve({
           _id: '02',
            title: 'backpack',
            username: 'jane',
            userId: '2222',
            description: 'a green backpack',
            status: 'Ok'
        });
      }
      return Promise.resolve(null);
    });
  })

  afterAll(() => {
    findByIdSpy.mockRestore();
    findByIdAndDeleteSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

    //test: correctly deleted
  test('should return 204 if the listing is deleted', async () =>{
    const res = await request(app)
      .delete(`/api/v1/listings/02`)
      .set('token', token);

    expect(res.statusCode).toBe(204);
  })

  //test: listing not found
  test('should return 404 if listing not found', async () =>{
    const res = await request(app)
      .delete(`/api/v1/listings/invalid`)
      .set('token', token);

      expect(res.statusCode).toBe(404);
  })

  test('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .delete(`/api/v1/listings/01`);

    expect(res.statusCode).toBe(401);
  });

    //test: user not authorized
  test('should return 403 if the user is not authorized to delete the listing', async () => {
    const res = await request(app)
      .delete(`/api/v1/listings/01`)
      .set('token', token);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  //test: database error
  test('should return 500 if there is a database error', async () => {
    findByIdSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .delete('/api/v1/listings/01')
      .set('token', token);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
})

describe('PUT /api/v1/listings/{listingId}', () => {
  let findByIdSpy;
  let saveSpy;
  let findByIdAndUpdateSpy;

  const payload = {
    id: '2222',
    username: 'jane',
  };
  const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 86400 });

  beforeAll(() => {
    findByIdSpy = jest.spyOn(Listing, 'findById').mockImplementation((id) =>{
      if (id === '01') {
        return Promise.resolve({
          _id: '01',
          title: 'cat',
          username: 'jhonny',
          userId: '12345',
          description: 'A cute cat',
          status: 'Very good'
        });
      }else if(id ==='02'){
        return Promise.resolve({
          _id: '02',
          title: 'backpack',
          username: 'jane',
          userId: '2222',
          description: 'a green backpack',
          status: 'Ok'
        });
      }
      return Promise.resolve(null);
    })

    findByIdAndUpdateSpy = jest.spyOn(Listing, 'findByIdAndUpdate').mockImplementation((id, update, options) => {
      if (id === '02') {  
        return Promise.resolve({
          _id: '02',
          title: update.title || 'backpack',
          username: 'jane',
          userId: '2222',
          description: update.description || 'a green backpack',
          status: update.status || 'Ok'
        });
    }
      return Promise.resolve(null);
    });
  });

  afterAll(() => {
    findByIdSpy.mockRestore();
    findByIdAndUpdateSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update the listing and return the updated listing', async () => {
    const res = await request(app)
      .put(`/api/v1/listings/02`)
      .set('token', token)
      .send({
        title: 'updated backpack',
        description: 'an updated green backpack',
        status: 'Very good'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'updated backpack');
    expect(res.body).toHaveProperty('description', 'an updated green backpack');
    expect(res.body).toHaveProperty('status', 'Very good');
  });

  test('should return 404 if listing not found', async () => {
    const res = await request(app)
      .put('/api/v1/listings/invalid')
      .set('token', token)
      .send({
        title: 'updated backpack',
        description: 'an updated green backpack',
        status: 'Very good'
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Listing not found');
  });

    //test: user not authorized (wrong token)
  test('should return 403 if the user is not authorized to update the listing', async () => {
    const res = await request(app)
      .put(`/api/v1/listings/01`)
      .set('token', token);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  //test: user not authenticated (no token)
  test('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .put(`/api/v1/listings/02`)
      .send({
        title: 'updated backpack',
        description: 'an updated green backpack',
        status: 'Very good'
      });

    expect(res.statusCode).toBe(401);
  });

  //test: wrong required fields
  test('should return 400 if required fields aren\'t correct', async () => {  
    const res = await request(app)
      .put(`/api/v1/listings/02`)
      .set('token', token)
      .send({ title: 's' });

    expect(res.statusCode).toBe(400);
  });

  test('should return 500 if there is a database error', async () => {
    findByIdSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .put(`/api/v1/listings/02`)
      .set('token', token)
      .send({
        title: 'updated backpack',
        description: 'an updated green backpack',
        status: 'Very good'
      });
      
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});