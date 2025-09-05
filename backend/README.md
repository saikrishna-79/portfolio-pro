# Portfolio Pro

A complete full-stack portfolio management application built with Node.js, Express.js, MongoDB, and React.js. Manage your professional portfolio with authentication, skills tracking, project showcase, work experience, and social links.

## 🏗️ Architecture

### Backend (Node.js + Express.js)
- **Authentication**: JWT-based with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, Helmet, Rate limiting
- **API**: RESTful endpoints with comprehensive validation

### Frontend (React.js)
- **Authentication**: Context-based auth management
- **Routing**: Protected routes with React Router
- **UI**: Modern responsive design with CSS Grid/Flexbox
- **State Management**: React hooks and context

### Database Schema
```
User -> Profile (1:1)
User -> Skills (1:Many)
User -> Projects (1:Many)
User -> Work (1:Many)
User -> Links (1:Many)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd portfolio-pro
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
Create a `.env` file in the root directory:
```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-pro?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

5. **Seed the database (optional)**
```bash
npm run seed
```

6. **Start the development servers**

Backend server:
```bash
npm run dev
```

Frontend server (in a new terminal):
```bash
npm run start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-token-here"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

### Profile Endpoints

#### Create Profile
```http
POST /profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "title": "Full Stack Developer",
  "bio": "Passionate developer...",
  "location": "San Francisco, CA",
  "phone": "+1234567890",
  "website": "https://johndoe.com"
}
```

#### Get Profile
```http
GET /profile
Authorization: Bearer <jwt-token>
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Senior Full Stack Developer",
  "bio": "Updated bio..."
}
```

#### Delete Profile
```http
DELETE /profile
Authorization: Bearer <jwt-token>
```

### Skills Endpoints

#### Add Skill
```http
POST /skills
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "JavaScript",
  "category": "Programming",
  "proficiency": 9,
  "yearsOfExperience": 5,
  "description": "Expert in modern JavaScript"
}
```

#### Get Skills
```http
GET /skills
Authorization: Bearer <jwt-token>

# Optional query parameters:
GET /skills?category=Programming&sort=proficiency
```

#### Get Top Skills
```http
GET /skills/top?limit=5
Authorization: Bearer <jwt-token>
```

#### Update Skill
```http
PUT /skills/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "proficiency": 10,
  "description": "Updated description"
}
```

#### Delete Skill
```http
DELETE /skills/:id
Authorization: Bearer <jwt-token>
```

### Projects Endpoints

#### Add Project
```http
POST /projects
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "description": "Full-stack e-commerce application...",
  "skills": ["JavaScript", "React", "Node.js"],
  "technologies": ["Express", "MongoDB", "JWT"],
  "status": "completed",
  "featured": true,
  "links": [
    {
      "type": "github",
      "url": "https://github.com/user/repo",
      "label": "Source Code"
    }
  ]
}
```

#### Get Projects
```http
GET /projects
Authorization: Bearer <jwt-token>

# Filter by skill:
GET /projects?skill=React

# Filter by status:
GET /projects?status=completed

# Get featured projects:
GET /projects?featured=true

# Pagination:
GET /projects?limit=10&page=1
```

#### Get Project by ID
```http
GET /projects/:id
Authorization: Bearer <jwt-token>
```

#### Update Project
```http
PUT /projects/:id
Authorization: Bearer <jwt-token>
```

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <jwt-token>
```

### Work Experience Endpoints

#### Add Work Experience
```http
POST /work
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "company": "TechCorp",
  "position": "Senior Developer",
  "location": "San Francisco, CA",
  "startDate": "2022-01-01",
  "current": true,
  "description": "Leading development team...",
  "responsibilities": ["Lead team", "Code review"],
  "achievements": ["Improved performance by 40%"],
  "skills": ["JavaScript", "React", "Leadership"],
  "employmentType": "full-time"
}
```

#### Get Work Experience
```http
GET /work
Authorization: Bearer <jwt-token>
```

#### Update Work Experience
```http
PUT /work/:id
Authorization: Bearer <jwt-token>
```

#### Delete Work Experience
```http
DELETE /work/:id
Authorization: Bearer <jwt-token>
```

### Links Endpoints

#### Add Link
```http
POST /links
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "platform": "github",
  "url": "https://github.com/username",
  "label": "My GitHub Profile",
  "description": "Check out my projects",
  "isPublic": true,
  "order": 1
}
```

#### Get Links
```http
GET /links
Authorization: Bearer <jwt-token>

# Filter by platform:
GET /links?platform=github

# Filter by visibility:
GET /links?isPublic=true
```

#### Update Link
```http
PUT /links/:id
Authorization: Bearer <jwt-token>
```

#### Delete Link
```http
DELETE /links/:id
Authorization: Bearer <jwt-token>
```

### Search Endpoint

#### Global Search
```http
GET /search?q=javascript
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "javascript",
    "results": {
      "skills": [...],
      "projects": [...],
      "work": [...],
      "links": [...]
    },
    "summary": {
      "totalResults": 15,
      "skillMatches": 3,
      "projectMatches": 8,
      "workMatches": 2,
      "linkMatches": 2
    }
  }
}
```

### Health Check

#### Health Status
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-09-04T18:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Profile Model
```javascript
{
  user: ObjectId (ref: User, required),
  name: String (required),
  email: String (required),
  title: String,
  bio: String (max: 500),
  location: String,
  phone: String,
  website: String,
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  skills: [ObjectId] (ref: Skill),
  projects: [ObjectId] (ref: Project),
  work: [ObjectId] (ref: Work),
  links: [ObjectId] (ref: Link)
}
```

### Skill Model
```javascript
{
  user: ObjectId (ref: User, required),
  name: String (required, max: 50),
  category: String (enum: ['Programming', 'Framework', 'Database', 'Tool', 'Language', 'Soft Skill', 'Other']),
  proficiency: Number (1-10, required),
  yearsOfExperience: Number (min: 0),
  description: String (max: 200),
  isActive: Boolean (default: true)
}
```

### Project Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required, max: 100),
  description: String (required, max: 1000),
  skills: [String],
  technologies: [String],
  links: [{
    type: String (enum: ['github', 'live', 'demo', 'documentation', 'other']),
    url: String (required),
    label: String
  }],
  status: String (enum: ['planning', 'in-progress', 'completed', 'on-hold']),
  startDate: Date,
  endDate: Date,
  featured: Boolean (default: false),
  imageUrl: String
}
```

### Work Model
```javascript
{
  user: ObjectId (ref: User, required),
  company: String (required, max: 100),
  position: String (required, max: 100),
  location: String,
  startDate: Date (required),
  endDate: Date,
  current: Boolean (default: false),
  description: String (max: 1000),
  responsibilities: [String],
  achievements: [String],
  skills: [String],
  employmentType: String (enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'])
}
```

### Link Model
```javascript
{
  user: ObjectId (ref: User, required),
  platform: String (enum: ['github', 'linkedin', 'portfolio', 'twitter', 'instagram', 'facebook', 'youtube', 'behance', 'dribbble', 'medium', 'dev.to', 'stackoverflow', 'other']),
  url: String (required, URL format),
  label: String (max: 50),
  description: String (max: 200),
  isPublic: Boolean (default: true),
  order: Number (default: 0)
}
```

## 🧪 Sample cURL Commands

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Profile
```bash
curl -X POST http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"John Doe","email":"john@example.com","title":"Full Stack Developer"}'
```

### Add Skill
```bash
curl -X POST http://localhost:5000/api/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"JavaScript","category":"Programming","proficiency":9}'
```

### Search
```bash
curl -X GET "http://localhost:5000/api/search?q=javascript" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Production Deployment

### Backend Deployment (Heroku)

1. **Create Heroku app**
```bash
heroku create your-app-name
```

2. **Set environment variables**
```bash
heroku config:set MONGO_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
```

3. **Deploy**
```bash
git push heroku main
```

### Frontend Deployment (Netlify)

1. **Build the React app**
```bash
cd client
npm run build
```

2. **Deploy to Netlify**
- Connect your GitHub repository to Netlify
- Set build command: `cd client && npm run build`
- Set publish directory: `client/build`
- Add environment variable: `REACT_APP_API_URL=https://your-heroku-app.herokuapp.com`

### Alternative: Full-Stack Deployment (Render)

1. **Create render.yaml**
```yaml
services:
  - type: web
    name: portfolio-pro
    env: node
    buildCommand: npm install && cd client && npm install && npm run build
    startCommand: npm start
    envVars:
      - key: MONGO_URI
        value: your-mongodb-atlas-uri
      - key: JWT_SECRET
        value: your-jwt-secret
      - key: NODE_ENV
        value: production
```

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run client` - Start React development server
- `npm run build` - Build React app for production

### Combined
- `npm run heroku-postbuild` - Build script for Heroku deployment

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent API abuse
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Input Validation**: Express-validator for request validation
- **MongoDB Injection Protection**: Mongoose built-in protection

## 🎯 Features

### Authentication
- ✅ User registration and login
- ✅ JWT token management
- ✅ Protected routes
- ✅ Password hashing with bcrypt

### Profile Management
- ✅ Create and update profile
- ✅ Education history tracking
- ✅ Contact information management

### Skills Tracking
- ✅ Add/edit/delete skills
- ✅ Proficiency levels (1-10)
- ✅ Skill categories
- ✅ Years of experience tracking
- ✅ Top skills display

### Project Showcase
- ✅ Project CRUD operations
- ✅ Skill and technology tagging
- ✅ Project links (GitHub, live demo, etc.)
- ✅ Featured projects
- ✅ Project status tracking
- ✅ Filter by skills

### Work Experience
- ✅ Employment history
- ✅ Responsibilities and achievements
- ✅ Skills used per role
- ✅ Employment types
- ✅ Current position tracking

### Social Links
- ✅ Multiple platform support
- ✅ Public/private visibility
- ✅ Custom labels and descriptions
- ✅ Display order management

### Search & Discovery
- ✅ Global search across all data
- ✅ Real-time search results
- ✅ Search result categorization

### Dashboard
- ✅ Portfolio statistics overview
- ✅ Recent projects display
- ✅ Top skills showcase
- ✅ Quick navigation

## 🐛 Known Limitations

1. **File Uploads**: No image upload functionality (uses URLs only)
2. **Email Verification**: No email verification on registration
3. **Password Reset**: No forgot password functionality
4. **Real-time Updates**: No WebSocket implementation
5. **Advanced Search**: No full-text search or filters
6. **Export Features**: No PDF/resume export functionality
7. **Analytics**: No usage analytics or visitor tracking
8. **Multi-language**: No internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 🙏 Acknowledgments

- Express.js team for the robust backend framework
- React team for the excellent frontend library
- MongoDB team for the flexible database solution
- All open-source contributors who made this project possible
