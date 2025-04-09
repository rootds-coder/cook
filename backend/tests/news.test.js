const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const News = require('../models/News');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Mock authentication token for protected routes
const generateTestToken = () => {
  return jwt.sign({ id: 'test-user-id' }, config.jwtSecret);
};

describe('News API', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fund_source_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await News.deleteMany({});
  });

  describe('GET /api/news', () => {
    it('should return all news articles', async () => {
      const testArticles = [
        {
          title: 'Test News 1',
          summary: 'Test Summary 1',
          content: 'Test Content 1',
          image: 'test1.jpg',
          category: 'Education',
          status: 'published'
        },
        {
          title: 'Test News 2',
          summary: 'Test Summary 2',
          content: 'Test Content 2',
          image: 'test2.jpg',
          category: 'Healthcare',
          status: 'published'
        }
      ];

      await News.create(testArticles);

      const response = await request(app)
        .get('/api/news')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: 'Test News 1' }),
          expect.objectContaining({ title: 'Test News 2' })
        ])
      );
    });

    it('should return published news articles only when status=published', async () => {
      await News.create([
        {
          title: 'Published News',
          summary: 'Published Summary',
          content: 'Published Content',
          image: 'published.jpg',
          category: 'Education',
          status: 'published'
        },
        {
          title: 'Draft News',
          summary: 'Draft Summary',
          content: 'Draft Content',
          image: 'draft.jpg',
          category: 'Healthcare',
          status: 'draft'
        }
      ]);

      const response = await request(app)
        .get('/api/news?status=published')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('title', 'Published News');
    });

    it('should handle database errors gracefully', async () => {
      // Force a database error by closing the connection
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/news')
        .expect(500);

      expect(response.body).toHaveProperty('message');

      // Reconnect for other tests
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fund_source_test');
    });
  });

  describe('GET /api/news/:id', () => {
    it('should return a single news article', async () => {
      const article = await News.create({
        title: 'Single Article',
        summary: 'Single Summary',
        content: 'Single Content',
        image: 'single.jpg',
        category: 'Education',
        status: 'published'
      });

      const response = await request(app)
        .get(`/api/news/${article._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('title', 'Single Article');
    });

    it('should return 404 for non-existent article', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/news/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'News article not found');
    });
  });

  describe('Protected Routes', () => {
    let testToken;

    beforeEach(() => {
      testToken = generateTestToken();
    });

    describe('POST /api/news', () => {
      it('should create a new news article with valid token', async () => {
        const newArticle = {
          title: 'New Article',
          summary: 'New Summary',
          content: 'New Content',
          image: 'new.jpg',
          category: 'Education',
          status: 'draft'
        };

        const response = await request(app)
          .post('/api/news')
          .set('Authorization', `Bearer ${testToken}`)
          .send(newArticle)
          .expect(201);

        expect(response.body).toHaveProperty('title', newArticle.title);
        expect(response.body).toHaveProperty('status', newArticle.status);

        // Verify it was saved to the database
        const savedArticle = await News.findById(response.body._id);
        expect(savedArticle).toBeTruthy();
        expect(savedArticle.title).toBe(newArticle.title);
      });

      it('should validate required fields', async () => {
        const invalidArticle = {
          title: 'Invalid Article'
          // Missing required fields
        };

        const response = await request(app)
          .post('/api/news')
          .set('Authorization', `Bearer ${testToken}`)
          .send(invalidArticle)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('should handle database errors during creation', async () => {
        const newArticle = {
          title: 'Error Article',
          summary: 'Error Summary',
          content: 'Error Content',
          image: 'error.jpg',
          category: 'Invalid Category', // This should trigger a validation error
          status: 'draft'
        };

        const response = await request(app)
          .post('/api/news')
          .set('Authorization', `Bearer ${testToken}`)
          .send(newArticle)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });
    });

    describe('PUT /api/news/:id', () => {
      it('should update an existing news article', async () => {
        const article = await News.create({
          title: 'Original Title',
          summary: 'Original Summary',
          content: 'Original Content',
          image: 'original.jpg',
          category: 'Education',
          status: 'draft'
        });

        const updates = {
          title: 'Updated Title',
          status: 'published'
        };

        const response = await request(app)
          .put(`/api/news/${article._id}`)
          .set('Authorization', `Bearer ${testToken}`)
          .send(updates)
          .expect(200);

        expect(response.body).toHaveProperty('title', updates.title);
        expect(response.body).toHaveProperty('status', updates.status);
      });

      it('should return 404 when updating non-existent article', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const updates = { title: 'Updated Title' };

        const response = await request(app)
          .put(`/api/news/${fakeId}`)
          .set('Authorization', `Bearer ${testToken}`)
          .send(updates)
          .expect(404);

        expect(response.body).toHaveProperty('message', 'News article not found');
      });

      it('should handle validation errors during update', async () => {
        const article = await News.create({
          title: 'Original Title',
          summary: 'Original Summary',
          content: 'Original Content',
          image: 'original.jpg',
          category: 'Education',
          status: 'draft'
        });

        const updates = {
          category: 'Invalid Category' // This should trigger a validation error
        };

        const response = await request(app)
          .put(`/api/news/${article._id}`)
          .set('Authorization', `Bearer ${testToken}`)
          .send(updates)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });
    });

    describe('DELETE /api/news/:id', () => {
      it('should delete an existing news article', async () => {
        const article = await News.create({
          title: 'To Be Deleted',
          summary: 'Delete Summary',
          content: 'Delete Content',
          image: 'delete.jpg',
          category: 'Education',
          status: 'draft'
        });

        await request(app)
          .delete(`/api/news/${article._id}`)
          .set('Authorization', `Bearer ${testToken}`)
          .expect(200);

        // Verify it was deleted from the database
        const deletedArticle = await News.findById(article._id);
        expect(deletedArticle).toBeNull();
      });

      it('should return 404 when deleting non-existent article', async () => {
        const fakeId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .delete(`/api/news/${fakeId}`)
          .set('Authorization', `Bearer ${testToken}`)
          .expect(404);

        expect(response.body).toHaveProperty('message', 'News article not found');
      });
    });
  });
}); 