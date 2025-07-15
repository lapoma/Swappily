const request = require('supertest');
const app = require('../app/app');
const Report = require('../app/models/report');
const User = require('../app/models/user');
const Listing = require('../app/models/listing');

jest.mock('../app/models/report');
jest.mock('../app/models/user');
jest.mock('../app/models/listing');

describe('Report API', () => {
  const base = {
    reporter: '/api/v1/users/user1',
    text: 'Inappropriate content'
  };

  afterEach(() => jest.clearAllMocks());

  // --- POST TESTS ---

  // 1. Crea un report verso uno user
  it('POST report to user - 201 Created', async () => {
    User.findById.mockImplementation(id => Promise.resolve({ _id: id }));
    Listing.findById.mockResolvedValue(null);
    Report.prototype.save = jest.fn().mockResolvedValue({
      _id: 'report1',
      reporterId: 'user1',
      reporteeId: 'user2',
      text: base.text
    });

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, reportee: '/api/v1/users/user2' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'report1');
    expect(res.body.reportee).toBe('user2');
    expect(res.body.listing).toBeNull();
  });

  // 2. Crea un report verso un listing
  it('POST report to listing - 201 Created', async () => {
    User.findById.mockImplementation(id => Promise.resolve({ _id: id }));
    Listing.findById.mockResolvedValue({ _id: 'listing1' });
    Report.prototype.save = jest.fn().mockResolvedValue({
      _id: 'report2',
      reporterId: 'user1',
      listingId: 'listing1',
      text: base.text
    });

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, listing: '/api/v1/listings/listing1' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'report2');
    expect(res.body.reportee).toBeNull();
    expect(res.body.listing).toBe('listing1');
  });

  // 3. Crea un report generico (richiesta di supporto)
  it('POST support request (no reportee or listing) - 201 Created', async () => {
    User.findById.mockResolvedValue({ _id: 'user1' });
    Report.prototype.save = jest.fn().mockResolvedValue({
      _id: 'reportSupport',
      reporterId: 'user1',
      text: base.text
    });

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base }); // Nessun reportee o listing

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'reportSupport');
    expect(res.body.reportee).toBeNull();
    expect(res.body.listing).toBeNull();
  });

  // 4. Errore se vengono forniti sia reportee che listing (caso vietato)
  it('POST both reportee and listing - 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, reportee: '/api/v1/users/user2', listing: '/api/v1/listings/listing1' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cannot report both/i);
  });

  // 5. Errore se manca il testo
  it('POST with missing text - 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/reports')
      .send({ reporter: '/api/v1/users/user1', reportee: '/api/v1/users/user2' });

    expect(res.status).toBe(400);
  });

  // 6. Errore se il testo è troppo lungo
  it('POST with too long text - 400 Bad Request', async () => {
    const longText = 'a'.repeat(2001);

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, listing: '/api/v1/listings/listing1', text: longText });

    expect(res.status).toBe(400);
  });

  // 7. Errore se il reporter non esiste
  it('POST - 404 Reporter not found', async () => {
    User.findById.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, reportee: '/api/v1/users/user2' });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/reporter/i);
  });

  // 8. Errore se il reportee non esiste
  it('POST - 404 Reportee not found', async () => {
    User.findById.mockImplementation(id =>
      Promise.resolve(id === 'user1' ? { _id: id } : null)
    );

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, reportee: '/api/v1/users/user2' });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/reportee/i);
  });

  // 9. Errore se il listing non esiste
  it('POST - 404 Listing not found', async () => {
    User.findById.mockResolvedValue({ _id: 'user1' });
    Listing.findById.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, listing: '/api/v1/listings/listing1' });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/listing/i);
  });

  // 10. Errore generico del database
  it('POST - 500 Internal Server Error', async () => {
    User.findById.mockResolvedValue({ _id: 'user1' });
    Listing.findById.mockResolvedValue({ _id: 'listing1' });
    Report.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/v1/reports')
      .send({ ...base, listing: '/api/v1/listings/listing1' });

    expect(res.status).toBe(500);
  });

  // --- GET TESTS ---

  // 11. Recupera report indirizzati a un user
  it('GET reports for user - 200 OK', async () => {
    User.findById.mockResolvedValue({ _id: 'user2' });
    Report.find.mockResolvedValue([
      {
        _id: 'report1',
        reporterId: 'user1',
        reporteeId: 'user2',
        listingId: null,
        text: 'Offensive'
      }
    ]);

    const res = await request(app).get('/api/v1/reports/user2');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].text).toBe('Offensive');
  });

  // 12. Nessun report trovato
  it('GET - 404 No reports found', async () => {
    User.findById.mockResolvedValue({ _id: 'user2' });
    Report.find.mockResolvedValue([]);

    const res = await request(app).get('/api/v1/reports/user2');
    expect(res.status).toBe(404);
  });

  // 13. Utente non trovato nella GET
  it('GET - 404 User not found', async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/v1/reports/missingUser');
    expect(res.status).toBe(404);
  });

  // 14. Errore del database nella GET
  it('GET - 500 DB error', async () => {
    User.findById.mockResolvedValue({ _id: 'user2' });
    Report.find.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/v1/reports/user2');
    expect(res.status).toBe(500);
  });

  // --- DELETE TESTS ---

  // 15. Eliminazione di un report esistente
  it('DELETE report - 204 No Content', async () => {
    Report.findByIdAndDelete.mockResolvedValue({ _id: 'report1' });

    const res = await request(app).delete('/api/v1/reports/report1');
    expect(res.status).toBe(204);
  });

  // 16. Report non trovato durante eliminazione
  it('DELETE report not found - 404 Not Found', async () => {
    Report.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app).delete('/api/v1/reports/unknown');
    expect(res.status).toBe(404);
  });
  // 17. Errore del database durante DELETE
it('DELETE - 500 Internal Server Error', async () => {
  Report.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('DB error'));

  const res = await request(app)
    .delete('/api/v1/reports/report123');

  expect(res.status).toBe(500);
  expect(res.body.error).toMatch(/server error/i);
});

});
