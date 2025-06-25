const request = require('supertest');
const app = require('../app/app');
const Report = require('../app/models/report');
const User = require('../app/models/user');
const Listing = require('../app/models/listing');

jest.mock('../app/models/report');
jest.mock('../app/models/user');
jest.mock('../app/models/listing');

describe('Report API', () => {
  const mockReport = {
    reporter: '/api/v1/users/user1',
    reportee: '/api/v1/users/user2',
    listing: '/api/v1/listings/listing1',
    text: 'Inappropriate content'
  };

  afterEach(() => jest.clearAllMocks()); //ripulisce i mock dopo ogni test

  // 1. Test creazione report successo
  it('POST /api/v1/reports - 201 Created', async () => {
    User.findById.mockImplementation(id => 
      Promise.resolve(id === 'user1' || id === 'user2' ? { _id: id } : null)
    );
    Listing.findById.mockResolvedValue({ _id: 'listing1' });
    
    const savedReport = {
      _id: 'report1',
      reporterId: 'user1',
      reporteeId: 'user2',
      listingId: 'listing1',
      text: 'Inappropriate content'
    };
    
    Report.prototype.save = jest.fn().mockResolvedValue(savedReport);

    const res = await request(app)
      .post('/api/v1/reports')
      .send(mockReport);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'report1');
  });

  // 2. Test campo text mancante
  it('POST /api/v1/reports - 400 Bad Request (text missing)', async () => {
    const res = await request(app)
      .post('/api/v1/reports')
      .send({...mockReport, text: ''});
    
    expect(res.status).toBe(400);
  });

  // 3. Test reporter non trovato
  it('POST /api/v1/reports - 404 Not Found (reporter)', async () => {
    User.findById.mockResolvedValueOnce(null); // Solo per reporter
    User.findById.mockResolvedValueOnce({ _id: 'user2' }); // Per reportee
    
    const res = await request(app)
      .post('/api/v1/reports')
      .send(mockReport);
    
    expect(res.status).toBe(404);
  });

  // 4. Test errore database
  it('POST /api/v1/reports - 500 Server Error', async () => {
    User.findById.mockResolvedValue({ _id: 'user1' });
    Listing.findById.mockResolvedValue({ _id: 'listing1' });
    Report.prototype.save = jest.fn().mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/v1/reports')
      .send(mockReport);
    
    expect(res.status).toBe(500);
  });

  // 5. Test get report esistente
  it('GET /api/v1/reports/:id - 200 OK', async () => {
    User.findById.mockResolvedValue({ _id: 'user2' });
    Report.find.mockResolvedValue([{
      _id: 'report1', 
      reporterId: 'user1', 
      reporteeId: 'user2', 
      listingId: 'listing1', 
      text: 'Test report'
    }]);

    const res = await request(app).get('/api/v1/reports/user2');
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('text', 'Test report');
  });

  // 6. Test nessun report trovato
  it('GET /api/v1/reports/:id - 404 Not Found (no reports)', async () => {
    User.findById.mockResolvedValue({ _id: 'user2' });
    Report.find.mockResolvedValue([]);

    const res = await request(app).get('/api/v1/reports/user2');
    expect(res.status).toBe(404);
  });

  // 7. Test utente non trovato
  it('GET /api/v1/reports/:id - 404 Not Found (user)', async () => {
    User.findById.mockResolvedValue(null);
    const res = await request(app).get('/api/v1/reports/nonexistent');
    expect(res.status).toBe(404);
  });

  // 8. Test errore database GET
  it('GET /api/v1/reports/:id - 500 Server Error', async () => {
    User.findById.mockResolvedValue({ _id: 'user2' });
    Report.find.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/v1/reports/user2');
    expect(res.status).toBe(500);
  });

  // 9. Test delete successo
  it('DELETE /api/v1/reports/:id - 204 No Content', async () => {
    Report.findByIdAndDelete.mockResolvedValue({ _id: 'report1' });
    const res = await request(app).delete('/api/v1/reports/report1');
    expect(res.status).toBe(204);
  });

  // 10. Test delete non trovato
  it('DELETE /api/v1/reports/:id - 404 Not Found', async () => {
    Report.findByIdAndDelete.mockResolvedValue(null);
    const res = await request(app).delete('/api/v1/reports/nonexistent');
    expect(res.status).toBe(404);
  });
  // 11. Test listing non trovato
  it('POST /api/v1/reports - 404 Not Found (listing)', async () => {
    User.findById.mockImplementation(id => 
      Promise.resolve(id === 'user1' || id === 'user2' ? { _id: id } : null)
    );
    Listing.findById.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/reports')
      .send(mockReport);
    
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/listing/i);
  });

  // 12. Test reportee non trovato
  it('POST /api/v1/reports - 404 Not Found (reportee)', async () => {
    User.findById.mockImplementation(id => 
      Promise.resolve(id === 'user1' ? { _id: id } : null)
    );
    Listing.findById.mockResolvedValue({ _id: 'listing1' });

    const res = await request(app)
      .post('/api/v1/reports')
      .send(mockReport);
    
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/reportee/i);
  });

  

  // 13. Test testo troppo lungo
  it('POST /api/v1/reports - 400 Bad Request (text too long)', async () => {
    const longText = 'a'.repeat(2001); // Supponendo un limite di 2000 caratteri
    
    const res = await request(app)
      .post('/api/v1/reports')
      .send({
        ...mockReport,
        text: longText
      });
    
    expect(res.status).toBe(400);
  });

  
});