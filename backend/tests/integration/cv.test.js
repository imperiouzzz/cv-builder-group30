const request  = require('supertest');
const app      = require('../../src/index');
const { PrismaClient } = require('@prisma/client');
const bcrypt   = require('bcryptjs');

const prisma = new PrismaClient();

let token;
let userId;
let cvId;

beforeAll(async () => {
  // Create test user and get token
  const email    = `cv_test_${Date.now()}@test.com`;
  const hashed   = await bcrypt.hash('Test1234!', 12);
  const user     = await prisma.user.create({ data: { email, password: hashed } });
  userId = user.id;

  const res  = await request(app).post('/api/auth/login').send({ email, password: 'Test1234!' });
  token      = res.body.token;
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: userId } });
  await prisma.$disconnect();
});

describe('POST /api/cvs', () => {
  it('creates a new empty CV', async () => {
    const res = await request(app)
      .post('/api/cvs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test CV' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test CV');
    expect(res.body.data.userId).toBe(userId);
    cvId = res.body.data.id;
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).post('/api/cvs').send({ title: 'x' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/cvs', () => {
  it('lists CVs for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/cvs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /api/cvs/:id', () => {
  it('fetches a CV by id', async () => {
    const res = await request(app)
      .get(`/api/cvs/${cvId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(cvId);
  });

  it('returns 404 for non-existent CV', async () => {
    const res = await request(app)
      .get('/api/cvs/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /api/cvs/:id', () => {
  it('saves personal info and sections', async () => {
    const payload = {
      title:    'Updated CV',
      fullName: 'Maurus Okang',
      email:    'maurus@test.com',
      phone:    '0535603362',
      jobTitle: 'Backend Developer',
      summary:  'Experienced backend developer with Django and Python skills.',
      skills: [
        { name: 'Python',  category: 'technical' },
        { name: 'Django',  category: 'technical' },
        { name: 'Git',     category: 'tool' },
      ],
      education: [
        { degree: 'BSc Computer Science', institution: 'KNUST', location: 'Kumasi', startDate: '', endDate: '2027', gpa: '', achievements: '' },
      ],
      workExp: [
        { title: 'Intern', company: 'Bsystems', location: 'Accra', startDate: 'Sep 2024', endDate: 'Oct 2024', description: '• Built REST APIs\n• Reduced bugs by 30%' },
      ],
      projects: [], volunteering: [], references: [], customSections: [],
    };

    const res = await request(app)
      .put(`/api/cvs/${cvId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.fullName).toBe('Maurus Okang');
    expect(res.body.data.skills).toHaveLength(3);
    expect(res.body.data.education).toHaveLength(1);
    expect(res.body.data.atsScore).toBeGreaterThan(0);
  });
});

describe('POST /api/cvs/:id/duplicate', () => {
  it('duplicates a CV', async () => {
    const res = await request(app)
      .post(`/api/cvs/${cvId}/duplicate`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toContain('(Copy)');
    expect(res.body.data.id).not.toBe(cvId);
  });
});

describe('DELETE /api/cvs/:id', () => {
  it('deletes a CV', async () => {
    const res = await request(app)
      .delete(`/api/cvs/${cvId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/cvs/${cvId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
