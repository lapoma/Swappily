const request = require('supertest');
const express = require('express');
const exchangeRouter = require('../app/exchanges');
const Exchange = require('../app/models/exchange');
const Listing = require('../app/models/listing');
const User = require('../app/models/user');
const jwt = require('jsonwebtoken');

jest.mock('../app/models/exchange');
jest.mock('../app/models/listing');
jest.mock('../app/models/user');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/v1/exchanges', exchangeRouter);

describe('Exchange API', () => {
    let token;

    beforeEach(() => {
        token = 'valid.token';
        jwt.verify.mockImplementation((tokenValue, secret, callback) => {
            if (tokenValue === 'valid.token') {
                callback(null, { id: 'user1' });
            } else {
                callback(new Error('Invalid token'));
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /listing/:listingId', () => {
        it('should create an exchange if input is valid', async () => {
            Listing.findById.mockImplementation((id) => {
                if (id === 'listing1') return Promise.resolve({ _id: 'listing1', userId: 'user2' });
                if (id === 'listing2') return Promise.resolve({ _id: 'listing2', userId: 'user1' });
                return Promise.resolve(null);
            });

            User.findById.mockResolvedValue({ _id: 'user2' });

            const mockSave = jest.fn().mockResolvedValue({ _id: 'exchange1', status: 'Pending', date: new Date() });
            Exchange.mockImplementation(() => ({ save: mockSave, _id: 'exchange1', sender: 'user1', receiver: 'user2', offeredListing: 'listing2', requestedListing: 'listing1', status: 'Pending', date: new Date() }));

            const res = await request(app)
                .post('/api/v1/exchanges/listing/listing1')
                .set('token', token)
                .send({ offeredListing: 'listing2', receiver: 'user2' });

            expect(res.statusCode).toBe(201);
            expect(res.body.exchangeId).toBe('exchange1');
        });
        
        

        it('should return 403 if user is not owner of offered listing', async () => {
            Listing.findById.mockResolvedValue({ _id: 'listing2', userId: 'otherUser' });
            User.findById.mockResolvedValue({ _id: 'user2' });

            const res = await request(app)
                .post('/api/v1/exchanges/listing/listing1')
                .set('token', token)
                .send({ offeredListing: 'listing2', receiver: 'user2' });

            expect(res.statusCode).toBe(403);
        });
        it('should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/v1/exchanges/listing/listing1')
            .set('token', token)
            .send({});
        
        expect(res.statusCode).toBe(400);
    });

    it('should return 401 when creating exchange with invalid token', async () => {
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error('Token non valido'));
    });

    const res = await request(app)
        .post('/api/v1/exchanges/listing/listing1')
        .set('token', 'invalid.token')
        .send({ offeredListing: 'listing2', receiver: 'user2' });

    expect(res.statusCode).toBe(401);
});

    it('should return 404 if requested listing not found', async () => {
        Listing.findById.mockResolvedValue(null);
        User.findById.mockResolvedValue({ _id: 'user2' });

        const res = await request(app)
            .post('/api/v1/exchanges/listing/invalid_listing')
            .set('token', token)
            .send({ offeredListing: 'listing2', receiver: 'user2' });

        expect(res.statusCode).toBe(404);
    });

    it('should return 404 if offered listing not found', async () => {
        Listing.findById.mockImplementation((id) => 
            id === 'listing1' ? Promise.resolve({ _id: 'listing1', userId: 'user2' }) : Promise.resolve(null)
        );
        User.findById.mockResolvedValue({ _id: 'user2' });

        const res = await request(app)
            .post('/api/v1/exchanges/listing/listing1')
            .set('token', token)
            .send({ offeredListing: 'invalid_listing', receiver: 'user2' });

        expect(res.statusCode).toBe(404);
    });

    it('should return 404 if receiver not found', async () => {
        Listing.findById.mockResolvedValue({ _id: 'listing1', userId: 'user2' });
        User.findById.mockResolvedValue(null);

        const res = await request(app)
            .post('/api/v1/exchanges/listing/listing1')
            .set('token', token)
            .send({ offeredListing: 'listing2', receiver: 'invalid_user' });

        expect(res.statusCode).toBe(404);
    });

    it('should return 500 on database error when saving exchange', async () => {
    Listing.findById.mockImplementation((id) => 
        id === 'listing1' ? Promise.resolve({ _id: 'listing1', userId: 'user2' }) : 
        id === 'listing2' ? Promise.resolve({ _id: 'listing2', userId: 'user1' }) : 
        Promise.resolve(null)
    );
    User.findById.mockResolvedValue({ _id: 'user2' });

    const mockExchange = {
        _id: 'exchange1',
        save: jest.fn().mockRejectedValue(new Error('DB error'))
    };
    Exchange.mockImplementation(() => mockExchange);

    const res = await request(app)
        .post('/api/v1/exchanges/listing/listing1')
        .set('token', token)
        .send({ offeredListing: 'listing2', receiver: 'user2' });

    expect(res.statusCode).toBe(500);
});
});

// 

    describe('GET /:exchangeId', () => {
      

        it('should return specific exchange', async () => {
            Exchange.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockReturnValue({
                            populate: jest.fn().mockResolvedValue({
                                _id: 'ex1',
                                sender: { _id: 'user1', username: 'user1' },
                                receiver: { _id: 'user2', username: 'user2' },
                                offeredListing: { _id: 'listing1', title: 'Item 1' },
                                requestedListing: { _id: 'listing2', title: 'Item 2' },
                                status: 'Pending',
                                date: new Date()
                            })
                        })
                    })
                })
            });

            const res = await request(app).get('/api/v1/exchanges/ex1');
            expect(res.statusCode).toBe(200);
            expect(res.body.exchangeId).toBe('ex1');
        });
        it('should return exchanges with status "accepted"', async () => {
  const mockExchange = {
    _id: 'exAccepted',
    status: 'accepted',
    sender: { _id: 'user1', username: 'User One' },
    receiver: { _id: 'user2', username: 'User Two' },
    offeredListing: { _id: 'listing1', title: 'Listing 1' },
    requestedListing: { _id: 'listing2', title: 'Listing 2' },
    date: new Date()
  };

  Exchange.find.mockImplementation((query) => {
    expect(query.status).toBe('accepted');
    return {
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([mockExchange])
          })
        })
      })
    };
  });

  const res = await request(app).get('/api/v1/exchanges?status=accepted');

  expect(res.statusCode).toBe(200);
  expect(res.body[0].status).toBe('accepted');
});
it('should return exchanges with status "Pending"', async () => {
  const mockExchange = {
    _id: 'expending',
    status: 'Pending',
    sender: { _id: 'user1', username: 'User One' },
    receiver: { _id: 'user2', username: 'User Two' },
    offeredListing: { _id: 'listing3', title: 'Listing 3' },
    requestedListing: { _id: 'listing4', title: 'Listing 4' },
    date: new Date()
  };

  Exchange.find.mockImplementation((query) => {
    expect(query.status).toBe('Pending');
    return {
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([mockExchange])
          })
        })
      })
    };
  });

  const res = await request(app).get('/api/v1/exchanges?status=Pending');

  expect(res.statusCode).toBe(200);
  expect(res.body[0].status).toBe('Pending');
});
it('should return exchanges with status "rejected"', async () => {
  const mockExchange = {
    _id: 'exRejected',
    status: 'rejected',
    sender: { _id: 'user3', username: 'User Three' },
    receiver: { _id: 'user4', username: 'User Four' },
    offeredListing: { _id: 'listing5', title: 'Listing 5' },
    requestedListing: { _id: 'listing6', title: 'Listing 6' },
    date: new Date()
  };

  Exchange.find.mockImplementation((query) => {
    expect(query.status).toBe('rejected');
    return {
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue([mockExchange])
          })
        })
      })
    };
  });

  const res = await request(app).get('/api/v1/exchanges?status=rejected');

  expect(res.statusCode).toBe(200);
  expect(res.body[0].status).toBe('rejected');
});


        it('should return list of exchanges', async () => {
            Exchange.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockReturnValue({
                            populate: jest.fn().mockResolvedValue([
                                {
                                    _id: 'ex1',
                                    sender: { _id: 'user1', username: 'user1' },
                                    receiver: { _id: 'user2', username: 'user2' },
                                    offeredListing: { _id: 'listing1', title: 'Item 1' },
                                    requestedListing: { _id: 'listing2', title: 'Item 2' },
                                    status: 'Pending',
                                    date: new Date()
                                }
                            ])
                        })
                    })
                })
            });

            const res = await request(app).get('/api/v1/exchanges');
            expect(res.statusCode).toBe(200);
            expect(res.body[0].exchangeId).toBe('ex1');
        });
        
it('should return 500 on database error', async () => {
        Exchange.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockRejectedValue(new Error('DB error'))
                    })
                })
            })
        });

        const res = await request(app).get('/api/v1/exchanges');
        expect(res.statusCode).toBe(500);
    });
        it('should return 404 if no exchanges found', async () => {
            Exchange.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockReturnValue({
                            populate: jest.fn().mockResolvedValue([])
                        })
                    })
                })
            });

            const res = await request(app).get('/api/v1/exchanges');
            expect(res.statusCode).toBe(404);
        });
        it('should return 404 if exchange not found', async () => {
        Exchange.findById.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockResolvedValue(null)
                    })
                })
            })
        });

        const res = await request(app).get('/api/v1/exchanges/invalid_exchange');
        expect(res.statusCode).toBe(404);
    });

    it('should return 500 on database error', async () => {
        Exchange.findById.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockRejectedValue(new Error('DB error'))
                    })
                })
            })
        });

        const res = await request(app).get('/api/v1/exchanges/ex1');
        expect(res.statusCode).toBe(500);
    });
    });
    

    describe('PUT/:exchangeId', () => {
        it('should update exchange status', async () => {
            const exchange = {
                _id: 'ex1',
                receiver: 'user1',
                status: 'Pending',
                save: jest.fn().mockResolvedValue(true)
            };

            Exchange.findById.mockResolvedValue(exchange);

            const res = await request(app)
                .put('/api/v1/exchanges/ex1')
                .set('token', token)
                .send({ status: 'accepted' });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('accepted');
        });
        
         it('should return 400 for invalid status', async () => {
        const exchange = {
            _id: 'ex1',
            receiver: 'user1',
            status: 'Pending',
            save: jest.fn()
        };

        Exchange.findById.mockResolvedValue(exchange);

        const res = await request(app)
            .put('/api/v1/exchanges/ex1')
            .set('token', token)
            .send({ status: 'invalid_status' });

        expect(res.statusCode).toBe(400);
    });

    it('should return 403 if user is not receiver', async () => {
        const exchange = {
            _id: 'ex1',
            receiver: 'user2', 
            status: 'Pending',
            save: jest.fn()
        };

        Exchange.findById.mockResolvedValue(exchange);

        const res = await request(app)
            .put('/api/v1/exchanges/ex1')
            .set('token', token)
            .send({ status: 'accepted' });

        expect(res.statusCode).toBe(403);
    });

    it('should return 404 if exchange not found', async () => {
        Exchange.findById.mockResolvedValue(null);

        const res = await request(app)
            .put('/api/v1/exchanges/invalid_exchange')
            .set('token', token)
            .send({ status: 'accepted' });

        expect(res.statusCode).toBe(404);
    });

    it('should return 500 on database error when saving', async () => {
        const exchange = {
            _id: 'ex1',
            receiver: 'user1',
            status: 'Pending',
            save: jest.fn().mockRejectedValue(new Error('DB error'))
        };

        Exchange.findById.mockResolvedValue(exchange);

        const res = await request(app)
            .put('/api/v1/exchanges/ex1')
            .set('token', token)
            .send({ status: 'accepted' });

        expect(res.statusCode).toBe(500);
    });
    });

    describe('DELETE /:exchangeId', () => {
        it('should delete an exchange if authorized', async () => {
            Exchange.findById.mockResolvedValue({
                _id: 'ex1',
                sender: 'user1',
                receiver: 'user2'
            });

            Exchange.findByIdAndDelete.mockResolvedValue(true);

            const res = await request(app)
                .delete('/api/v1/exchanges/ex1')
                .set('token', token);

            expect(res.statusCode).toBe(204);
        });

        it('should return 403 if not authorized to delete', async () => {
            Exchange.findById.mockResolvedValue({
                _id: 'ex1',
                sender: 'user2',
                receiver: 'user3'
            });

            const res = await request(app)
                .delete('/api/v1/exchanges/ex1')
                .set('token', token);

            expect(res.statusCode).toBe(403);
        });
         it('should allow receiver to delete exchange', async () => {
        Exchange.findById.mockResolvedValue({
            _id: 'ex1',
            sender: 'user2',
            receiver: 'user1' // Matches token user
        });

        Exchange.findByIdAndDelete.mockResolvedValue(true);

        const res = await request(app)
            .delete('/api/v1/exchanges/ex1')
            .set('token', token);

        expect(res.statusCode).toBe(204);
    });

    it('should return 404 if exchange not found', async () => {
        Exchange.findById.mockResolvedValue(null);

        const res = await request(app)
            .delete('/api/v1/exchanges/invalid_exchange')
            .set('token', token);

        expect(res.statusCode).toBe(404);
    });

    it('should return 500 on database error', async () => {
        Exchange.findById.mockResolvedValue({
            _id: 'ex1',
            sender: 'user1',
            receiver: 'user2'
        });
        Exchange.findByIdAndDelete.mockRejectedValue(new Error('DB error'));

        const res = await request(app)
            .delete('/api/v1/exchanges/ex1')
            .set('token', token);

        expect(res.statusCode).toBe(500);
    });

   it('should return 401 for invalid token', async () => {
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
    });

    Exchange.findById.mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
    }));

    const res = await request(app)
        .delete('/api/v1/exchanges/ex1')
        .set('token', 'invalid.token');

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
});
    });
});
