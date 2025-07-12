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
// 1. Test per ottenere recensioni di un utente
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
// 2. Test per ottenere recensioni di un utente che non ha recensioni
    it('404 quando l’utente esiste ma non ha recensioni', async () => {
      User.findById.mockResolvedValueOnce({ _id: 'user999' });
      Review.find.mockResolvedValueOnce([]);

      const res = await request(app).get('/api/v1/reviews/user999');
      expect(res.statusCode).toBe(404);
    });
// 3. Test per ottenere recensioni di un utente che non esiste
    it('404 quando l’utente non esiste', async () => {
      User.findById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/v1/reviews/unknown');
      expect(res.statusCode).toBe(404);
    });
// 4. Test per errore imprevisto
    it('500 su errore imprevisto', async () => {
      User.findById.mockResolvedValueOnce({ _id: 'user456' });
      Review.find.mockRejectedValueOnce(new Error('DB failure'));

      const res = await request(app).get('/api/v1/reviews/user456');
      expect(res.statusCode).toBe(500);
    });
  });
  describe('POST /api/v1/reviews', () => {
    // 5. Test per creare una recensione

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

    // 6. Test per validazione dei campi obbligatori
    test('400 quando mancano campi obbligatori', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({ reviewer: 'user123' }); // Manca reviewed e text

      expect(res.statusCode).toBe(400);
    });
// 7. Test per errore di salvataggio
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
    // 8. Test per quando text è una stringa vuota
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
// 9. Test per quando text non è una stringa
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
// 10. Test per quando reviewer e reviewed sono uguali
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
// 11 Test validazione se reviewer o reviewed non esiste
    test('400 se uno tra reviewer o reviewed è mancante', async () => {
      const res = await request(app)
        .post('/api/v1/reviews')
        .send({
          reviewed: 'user456',
          text: 'Missing reviewer'
        });

      expect(res.statusCode).toBe(400);
    });
// 12 Test validazione testo troppo lungo
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

// 13. Test per eliminare una recensione
  describe('DELETE /api/v1/reviews/:id', () => {
    it('204 quando elimina con successo', async () => {
      Review.findByIdAndDelete.mockResolvedValueOnce({ _id: 'r1' });
      const res = await request(app).delete('/api/v1/reviews/r1');
      expect(res.statusCode).toBe(204);
    });
// 14. Test per eliminare una recensione che non esiste
    it('404 quando non trova la review', async () => {
      Review.findByIdAndDelete.mockResolvedValueOnce(null);
      const res = await request(app).delete('/api/v1/reviews/notfound');
      expect(res.statusCode).toBe(404);
    });
// 15. Test per errore di database durante l’eliminazione
    it('500 su errore di delete', async () => {
      Review.findByIdAndDelete.mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).delete('/api/v1/reviews/r1');
      expect(res.statusCode).toBe(500);
    });
  });
});
