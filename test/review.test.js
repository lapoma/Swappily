const request = require('supertest');
const app = require('../app/app');
const Review = require('../app/models/review');
const User = require('../app/models/user');

jest.mock('../app/models/review');
jest.mock('../app/models/user');

describe('Review API', () => {
  // Il controller si aspetta req.body.text
  const mockReviewBody = {
    reviewer: 'user123',
    reviewed: 'user456',
    text: 'Great trade!'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    it('404 quando l’utente esiste ma non ha recensioni', async () => {
      User.findById.mockResolvedValueOnce({ _id: 'user999' });
      Review.find.mockResolvedValueOnce([]);

      const res = await request(app).get('/api/v1/reviews/user999');
      expect(res.statusCode).toBe(404);
    });

    it('404 quando l’utente non esiste', async () => {
      User.findById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/v1/reviews/unknown');
      expect(res.statusCode).toBe(404);
    });

    it('500 su errore imprevisto', async () => {
      User.findById.mockResolvedValueOnce({ _id: 'user456' });
      Review.find.mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app).get('/api/v1/reviews/user456');
      expect(res.statusCode).toBe(500);
    });
  });

  describe('POST /api/v1/reviews', () => {
    // Ecco dove inserire il tuo test
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
        date: expect.any(String) // O Date se non viene convertito
      });
    });

    // Aggiungi qui gli altri test per POST (400, 500 ecc...)
    test('400 quando mancano campi obbligatori', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({ reviewer: 'user123' }); // Manca reviewed e text

      expect(res.statusCode).toBe(400);
    });

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
  });


  describe('DELETE /api/v1/reviews/:id', () => {
    it('204 quando elimina con successo', async () => {
      Review.findByIdAndDelete.mockResolvedValueOnce({ _id: 'r1' });
      const res = await request(app).delete('/api/v1/reviews/r1');
      expect(res.statusCode).toBe(204);
    });

    it('404 quando non trova la review', async () => {
      Review.findByIdAndDelete.mockResolvedValueOnce(null);
      const res = await request(app).delete('/api/v1/reviews/notfound');
      expect(res.statusCode).toBe(404);
    });

    it('500 su errore di delete', async () => {
      Review.findByIdAndDelete.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).delete('/api/v1/reviews/r1');
      expect(res.statusCode).toBe(500);
    });
  });
});
