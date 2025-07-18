require('dotenv').config();
const request = require('supertest'); //https://www.npmjs.com/package/supertest
const jwt = require('jsonwebtoken');
const app = require('../app/app');
const Listing = require('../app/models/listing');
const User = require('../app/models/user'); 
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

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

    existsSpy = jest.spyOn(User, 'exists').mockImplementation((criteria) => {
      if(criteria?._id === '12345'){
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });

    hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123!');

    saveSpy = jest.spyOn(Listing.prototype, 'save').mockImplementation(function(){
      return Promise.resolve({
        _id: '01',
        title: 'cat',
        username: 'jhonny',
        userId: '12345',
        description: 'A cute cat',
        status: 'Good',
        listing_url: ['https://example.com/image1.jpg']
      })
    });

    findUserByIdSpy = jest.spyOn(User, 'findById').mockImplementation((id) =>{
      if(id === payload.id){
        return Promise.resolve({
          id:payload.id,
          username: payload.username,
          remove: jest.fn().mockResolvedValue(true)
        })
      }
      return Promise.resolve(null);
    })
  });
  
  afterAll( async () => {
    findSpy.mockRestore();
    hashSpy.mockRestore();
    saveSpy.mockRestore();
    existsSpy.mockRestore();
    findUserByIdSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  // POST listing
  test('should create a new listing', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        title: 'cat',
        userId: '12345',
        username: 'jhonny',
        description: 'A cute cat',
        status: 'Good',
        available: true,
        listing_url: ['https://example.com/image1.jpg']
      });
    
    console.log(res.body);  
  
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');  
    expect(res.body.title).toBe('cat');
  });

  // Campi mancanti
  test('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({ title: 'cat' });
      expect(res.statusCode).toBe(400);
  });

  // Campi non corretti
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

  // Descrizione non corretta
  test('should return 400 if description is not the correct length', async() =>{
    const res= await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        title: 'cat',
        username: 'jhonny',
        description: 'x',
        status: 'Good'})
        expect(res.statusCode).toBe(400);
  })

  // UserId non valido
  test('should return 400 if userId is not a valid Id', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('token', token)
      .send({
        title: 'cat',
        username: 'jhonny',
        userId: 'invalidUserId',
        description: 'A cute cat',
        status: 'Good',
        listing_url: ['https://example.com/image1.jpg']
      });

    expect(res.statusCode).toBe(400);
  });

  // User non autenticato
  test('should return 401 if no token is provided', async() =>{
    const res = await request(app)
    .post('/api/v1/listings')
    .send({
      title: 'cat',
      username: 'jhonny',
      userId: '12345',
      description: 'A cute cat',
      status: 'Good',
      listing_url: ['https://example.com/image1.jpg']
    });
    expect(res.statusCode).toBe(401);
  })
 
  // Server Error
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
        status: 'Good',
        listing_url: ['https://example.com/image1.jpg']
      });
    expect(res.statusCode).toBe(500);
  });
})

describe('GET /api/v1/listings', () =>{
  //https://jestjs.io/docs/mock-functions
  let findSpy;
  let findUserSpy;

  beforeAll( async () =>{
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
        return Promise.resolve([]);
    })
    });

    afterAll(async() =>{
        findSpy.mockRestore();
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    // GET tutti i listing
    test('should return 200 and all the listings', async() =>{
        const res= request(app)
      .get('/api/v1/listings');
        expect((await res).statusCode).toBe(200);
    });

    // Ritorna listing dal titolo
    test('should return 200 and the listings fitting the criteria',async() =>{
        const res = await request(app)
        .get('/api/v1/listings')
        .query({
            title: 'cat'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body[0].title).toBe('cat');
    });

    // Ritorna listing da status
    test('should return 200 and the listings filtered by status', async() =>{
        const res = await request(app)
        .get('/api/v1/listings')
        .query({
            status: 'Ok'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body[0].status).toBe('Ok');
    });
  
    // Rirtorna i documenti per listing e titolo
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

// GET listing per ID
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

  // Ritorna listing per id
  test('should return the listing by ID', async () => {
    const res = await request(app)
      .get('/api/v1/listings/01');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'cat');
  });

  // Listing non trovato
  test('should return 404 if listing not found', async () => {
    const res = await request(app)
      .get('/api/v1/listings/invalidListingId');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Listing not found');
  });

  // Server Error
  test('should return 500 if there is a database error', async () => {
    findByIdSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .get('/api/v1/listings/01');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
})

// DELETE listing
describe('DELETE  /api/v1/listings/{listingId}', () =>{
  let findByIdSpy;
  let findByIdAndDeleteSpy;

  const payload = {
      id: '2222',
      username: 'jane',
  };
  const token = jwt.sign(payload, process.env.SUPER_SECRET, {expiresIn: 86400});

  beforeAll(()=>{
    findByIdSpy = jest.spyOn(Listing, 'findById').mockImplementation((id) => {
      if (id === '01') {
        return Promise.resolve({
          _id: '01',
          title: 'cat',
          username: 'jhonny',
          userId: '12345',
          description: 'A cute cat',
          status: 'Very good',
          remove: jest.fn().mockResolvedValue(true)
        });
      }
      if(id === '02'){
        return Promise.resolve({
          _id: '02',
          title: 'backpack',
          username: 'jane',
          userId: '2222',
          description: 'a green backpack',
          status: 'Ok',
          remove: jest.fn().mockResolvedValue(true)
        });
      }
      return Promise.resolve(null);
    });

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
  
    // Eliminato correttamente
    test('should return 204 if the listing is deleted', async () =>{
      const res = await request(app)
        .delete(`/api/v1/listings/02`)
        .set('token', token);
  
      expect(res.statusCode).toBe(204);
    })
  
    // Listing non trovato
    test('should return 404 if listing not found', async () =>{
      const res = await request(app)
        .delete(`/api/v1/listings/invalid`)
        .set('token', token);
  
        expect(res.statusCode).toBe(404);
    })
  
    // No token
    test('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .delete(`/api/v1/listings/01`);
  
      expect(res.statusCode).toBe(401);
    });
  
    // Utente non autorizzato
    test('should return 403 if the user is not authorized to delete the listing', async () => {
      const res = await request(app)
        .delete(`/api/v1/listings/01`)
        .set('token', token);
  
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });
  
    // Server error
    test('should return 500 if there is a database error', async () => {
      findByIdSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));
  
      const res = await request(app)
        .delete('/api/v1/listings/01')
        .set('token', token);
  
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
  })

// PUT listing
describe('PUT /api/v1/listings/{listingId}', () => {
    let findByIdSpy;
    let findByIdAndUpdateSpy;
  
    const payload = {
      id: '2222',
      username: 'jane',
    };
    const token = jwt.sign(payload, process.env.SUPER_SECRET, { expiresIn: 86400 });
  
    beforeAll(() => {
      findByIdSpy = jest.spyOn(Listing, 'findById').mockImplementation((id) => {
        if (id === '01') {
          return Promise.resolve({
            _id: '01',
            title: 'cat',
            username: 'jhonny',
            userId: '12345',
            description: 'A cute cat',
            status: 'Very good',
          });
        } else if (id === '02') {
          return Promise.resolve({
            _id: '02',
            title: 'backpack',
            username: 'jane',
            userId: '2222',
            description: 'a green backpack',
            status: 'Ok',
          });
        }
        return Promise.resolve(null);
      });
  
      findByIdAndUpdateSpy = jest.spyOn(Listing, 'findByIdAndUpdate').mockImplementation((id, update, options) => {
        if (id === '02') {
          return Promise.resolve({
            _id: '02',
            title: update.title || 'backpack',
            username: 'jane',
            userId: '2222',
            description: update.description || 'a green backpack',
            status: update.status || 'Ok',
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
  
    // Aggiorna listing
    test('should update the listing and return the updated listing', async () => {
      const res = await request(app)
        .put(`/api/v1/listings/02`)
        .set('token', token)
        .send({
          title: 'Updated backpack',
          userId: '64a6f4f1d2a56789abcd1234',  
          description: 'An updated green backpack',
          status: 'Good', 
          available: true,
          listing_url: ['https://example.com/image2.jpg']
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title', 'Updated backpack');
    });

  // Listing non trovato
    test('should return 404 if listing not found', async () => {
      const res = await request(app)
        .put('/api/v1/listings/invalid')
        .set('token', token)
        .send({
          title: 'updated backpack',
          userId: '64a6f4f1d2a56789abcd1234', 
          description: 'an updated green backpack',
          status: 'Good',
          listing_url: ['https://example.com/image2.jpg']
        });
  
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Listing not found');
    });
  
    // User non autorizzato
    test('should return 403 if the user is not authorized to update the listing', async () => {
      const res = await request(app)
        .put('/api/v1/listings/01') 
        .set('token', token)
        .send({
          title: 'updated cat',
          userId: '64a6f4f1d2a56789abcd1234', 
          description: 'updated description',
          status: 'Good',
          listing_url: ['https://example.com/image2.jpg']
        });
  
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Forbidden');
    });
  
    // User non autenticato
    test('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .put('/api/v1/listings/02')
        .send({
          title: 'updated backpack',
          userId: '64a6f4f1d2a56789abcd1234', 
          description: 'an updated green backpack',
          status: 'Good',
          listing_url: ['https://example.com/image2.jpg']
        });
  
      expect(res.statusCode).toBe(401);
    });
  
    // Campi invalidi
    test("should return 400 if required fields aren't correct", async () => {
      const res = await request(app)
        .put('/api/v1/listings/02')
        .set('token', token)
        .send({ title: 's' });
  
      expect(res.statusCode).toBe(400);
    });
  
    // Server error
    test('should return 500 if there is a database error', async () => {
      findByIdSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));
  
      const res = await request(app)
        .put('/api/v1/listings/02')
        .set('token', token)
        .send({
          title: 'updated backpack',
          userId: '64a6f4f1d2a56789abcd1234', 
          description: 'an updated green backpack',
          status: 'Good',
          listing_url: ['https://example.com/image2.jpg']
        });
  
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Internal server error');
    });
});

// GET listing da user
describe('GET /api/v1/listings/user/:userId', () => {
  let findSpy;
  let isValidObjectIdSpy;

  beforeAll(() => {
    findSpy = jest.spyOn(Listing, 'find').mockImplementation((criteria) => {
      if (criteria.userId === '12345') {
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
            title: 'laptop',
            username: 'jhonny',
            userId: '12345',
            description: 'MacBook Pro',
            status: 'Good'
          }
        ]);
      }
      return Promise.resolve([]);
    });

    isValidObjectIdSpy = jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockImplementation((id) => {
      return id === '12345' || id === '2222';
    });
  });

  afterAll(() => {
    findSpy.mockRestore();
    isValidObjectIdSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Ritorna tutti i listing di uno user
  test('should return 200 and listings for a valid user ID', async () => {
    const res = await request(app)
      .get('/api/v1/listings/user/12345');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].userId).toBe('12345');
    expect(res.body[1].userId).toBe('12345');
  });

  // No listing trovati per lo user
  test('should return 404 if no listings found for the user', async () => {
    const res = await request(app)
      .get('/api/v1/listings/user/2222');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('No listings found for this user');
  });

  // UserId con formato invalido
  test('should return 400 for invalid user ID format', async () => {
    const res = await request(app)
      .get('/api/v1/listings/user/invalidUserId');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('"userId" must be a valid ObjectId');
  });

  // Server error
  test('should return 500 if there is a database error', async () => {
    findSpy.mockImplementationOnce(() => Promise.reject(new Error('Database error')));

    const res = await request(app)
      .get('/api/v1/listings/user/12345');

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});