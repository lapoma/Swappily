const request = require('supertest');
const app = require('../app/app');
const Review = require('../app/models/review');
const User = require('../app/models/user');

jest.mock('../app/models/review');
jest.mock('../app/models/user');

describe('Review API', () => {
  const mockReviewBody = {
    reviewer: 'user123',
    reviewed: 'user456',
    text: 'Great trade!'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

// Test per ottenere recensioni di un utente
  describe('GET /api/v1/reviews/:userid', () => {
    it('200 quando ci sono recensioni', async () => {
      User.findById.mockResolvedValueOnce({ _id: 'user456' });
      Review.find.mockResolvedValueOnce([
        {
          _id: 'rev1',
          reviewer: 'user123',
          reviewed: 'user456',
          text: 'Great trade!',
          date: new Date()
        }
      ]);

      const res = await request(app).get('/api/v1/reviews/user456');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('text', 'Great trade!');
    });

// Recensioni di un utente che non ha recensioni
    it('404 quando l’utente esiste ma non ha recensioni', async () => {
      User.findById.mockResolvedValueOnce({ _id: 'user999' });
      Review.find.mockResolvedValueOnce([]);

      const res = await request(app).get('/api/v1/reviews/user999');
      expect(res.statusCode).toBe(404);
    });

// Recensioni di un utente che non esiste
    it('404 quando l’utente non esiste', async () => {
      User.findById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/v1/reviews/unknown');
      expect(res.statusCode).toBe(404);
    });

// Server Error
    it('500 su errore imprevisto', async () => {
      User.findById.mockResolvedValueOnce({ _id: 'user456' });
      Review.find.mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app).get('/api/v1/reviews/user456');
      expect(res.statusCode).toBe(500);
    });
  });

  // POST recensione
  describe('POST /api/v1/reviews', () => {

    // Recensione creata
    test('201 quando la recensione viene creata', async () => {
      const mockReviewBody = {
        reviewer: 'user123',
        reviewed: 'user456',
        text: 'Great trade!',
      };

      const savedReview = {
        _id: 'r1',
        ...mockReviewBody,
        date: new Date()
      };
      
      Review.prototype.save = jest.fn().mockResolvedValueOnce(savedReview);

      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Content-Type', 'application/json')
        .send(mockReviewBody);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        self: '/api/v1/reviews/r1',
        id: 'r1',
        reviewer: 'user123',
        reviewed: 'user456',
        text: 'Great trade!',
        date: expect.any(String) 
      });
    });

    // Mancano campi obbligatori
    test('400 quando mancano campi obbligatori', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({ reviewer: 'user123' }); 

      expect(res.statusCode).toBe(400);
    });

  // Server error
    test('500 su errore di salvataggio', async () => {
      const validReview = {
        reviewer: 'user123',
        reviewed: 'user456',
        text: 'Great trade!'
      };

      Review.prototype.save = jest.fn().mockRejectedValueOnce(new Error('DB error'));

      const res = await request(app)
        .post('/api/v1/reviews')
        .send(validReview);

      expect(res.statusCode).toBe(500);
    });

    // Text è una vuoto
        test('400 quando text è una stringa vuota', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({
          reviewer: 'user123',
          reviewed: 'user456',
          text: ''
        });

      expect(res.statusCode).toBe(400);
    });

  //Text non è una stringa
    test('400 quando text non è una stringa', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({
          reviewer: 'user123',
          reviewed: 'user456',
          text: 12345 // non stringa
        });

      expect(res.statusCode).toBe(400);
    });

  // Reviewer e reviewed sono uguali
    test('400 se reviewer o reviewed sono uguali', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({
          reviewer: 'user123',
          reviewed: 'user123', // uguali
          text: 'Auto-review'
        });

      expect(res.statusCode).toBe(400);
    });

  // Controlla se reviewer o reviewed non esistono
    test('400 se uno tra reviewer o reviewed è mancante', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({
          reviewed: 'user456',
          text: 'Missing reviewer'
        });

      expect(res.statusCode).toBe(400);
    });

// Testo troppo lungo
  it('POST /api/v1/reviews - 400 con testo troppo lungo', async () => {
    const longText = 'a'.repeat(2001); // Testo di 2001 caratteri
    const res = await request(app)
      .post('/api/v1/reviews')
      .send({
        reviewer: 'user123',
        reviewed: 'user456',
        text: longText
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/too long/i);
  });
  });

// DELETE recensione
  describe('DELETE /api/v1/reviews/:id', () => {
    it('204 quando elimina con successo', async () => {
      Review.findByIdAndDelete.mockResolvedValueOnce({ _id: 'r1' });
      const res = await request(app).delete('/api/v1/reviews/r1');
      expect(res.statusCode).toBe(204);
    });

// La recensione che non esiste
    it('404 quando non trova la review', async () => {
      Review.findByIdAndDelete.mockResolvedValueOnce(null);
      const res = await request(app).delete('/api/v1/reviews/notfound');
      expect(res.statusCode).toBe(404);
    });
    
// Server error
    it('500 su errore di delete', async () => {
      Review.findByIdAndDelete.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).delete('/api/v1/reviews/r1');
      expect(res.statusCode).toBe(500);
    });
  });
});
