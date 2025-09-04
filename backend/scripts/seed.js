const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Work = require('../models/Work');
const Link = require('../models/Link');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Work.deleteMany({});
    await Link.deleteMany({});
    console.log('Cleared existing data');

    // Create sample user
    const sampleUser = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });
    await sampleUser.save();
    console.log('Created sample user');

    // Create sample skills
    const skills = [
      {
        user: sampleUser._id,
        name: 'JavaScript',
        category: 'Programming',
        proficiency: 9,
        yearsOfExperience: 5,
        description: 'Expert in modern JavaScript ES6+ features, async programming, and frameworks'
      },
      {
        user: sampleUser._id,
        name: 'React.js',
        category: 'Framework',
        proficiency: 8,
        yearsOfExperience: 3,
        description: 'Proficient in React hooks, context API, and component lifecycle'
      },
      {
        user: sampleUser._id,
        name: 'Node.js',
        category: 'Programming',
        proficiency: 8,
        yearsOfExperience: 4,
        description: 'Backend development with Express.js, RESTful APIs, and microservices'
      },
      {
        user: sampleUser._id,
        name: 'MongoDB',
        category: 'Database',
        proficiency: 7,
        yearsOfExperience: 3,
        description: 'NoSQL database design, aggregation pipelines, and performance optimization'
      },
      {
        user: sampleUser._id,
        name: 'Python',
        category: 'Programming',
        proficiency: 7,
        yearsOfExperience: 2,
        description: 'Data analysis, web scraping, and automation scripts'
      },
      {
        user: sampleUser._id,
        name: 'Git',
        category: 'Tool',
        proficiency: 8,
        yearsOfExperience: 5,
        description: 'Version control, branching strategies, and collaborative development'
      },
      {
        user: sampleUser._id,
        name: 'Leadership',
        category: 'Soft Skill',
        proficiency: 7,
        yearsOfExperience: 2,
        description: 'Team leadership, mentoring junior developers, and project management'
      },
      {
        user: sampleUser._id,
        name: 'Docker',
        category: 'Tool',
        proficiency: 6,
        yearsOfExperience: 2,
        description: 'Containerization, Docker Compose, and deployment strategies'
      }
    ];

    const createdSkills = await Skill.insertMany(skills);
    console.log('Created sample skills');

    // Create sample projects
    const projects = [
      {
        user: sampleUser._id,
        title: 'MY-API-PLAYGROUND E-commerce Platform',
        description: 'Full-stack e-commerce platform with React frontend, Node.js backend, and MongoDB database. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard for inventory management.',
        skills: ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Express.js'],
        technologies: ['JWT', 'Stripe API', 'Mongoose', 'bcrypt'],
        status: 'completed',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-04-30'),
        featured: true,
        links: [
          { type: 'github', url: 'https://github.com/johndoe/ecommerce-platform', label: 'Source Code' },
          { type: 'live', url: 'https://ecommerce-demo.herokuapp.com', label: 'Live Demo' }
        ]
      },
      {
        user: sampleUser._id,
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates using Socket.io. Users can create projects, assign tasks, set deadlines, and track progress with an intuitive Kanban board interface.',
        skills: ['React.js', 'Node.js', 'Socket.io', 'MongoDB'],
        technologies: ['Express.js', 'Mongoose', 'JWT', 'Material-UI'],
        status: 'completed',
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-07-15'),
        featured: true,
        links: [
          { type: 'github', url: 'https://github.com/johndoe/task-manager', label: 'Repository' },
          { type: 'demo', url: 'https://task-manager-demo.netlify.app', label: 'Demo' }
        ]
      },
      {
        user: sampleUser._id,
        title: 'Weather Dashboard',
        description: 'A responsive weather dashboard that displays current weather conditions and 7-day forecasts for multiple cities. Built with vanilla JavaScript and integrates with OpenWeatherMap API.',
        skills: ['JavaScript', 'HTML5', 'CSS3', 'API Integration'],
        technologies: ['OpenWeatherMap API', 'Chart.js', 'Local Storage'],
        status: 'completed',
        startDate: new Date('2022-11-01'),
        endDate: new Date('2022-12-15'),
        featured: false,
        links: [
          { type: 'github', url: 'https://github.com/johndoe/weather-dashboard', label: 'Code' },
          { type: 'live', url: 'https://weather-dashboard-js.netlify.app', label: 'Live Site' }
        ]
      },
      {
        user: sampleUser._id,
        title: 'Portfolio Website',
        description: 'Personal portfolio website showcasing my projects and skills. Built with React and deployed on Netlify with continuous integration from GitHub.',
        skills: ['React.js', 'CSS3', 'JavaScript'],
        technologies: ['React Router', 'Styled Components', 'Netlify'],
        status: 'completed',
        startDate: new Date('2023-08-01'),
        endDate: new Date('2023-08-30'),
        featured: false,
        links: [
          { type: 'portfolio', url: 'https://johndoe-portfolio.netlify.app', label: 'Portfolio' },
          { type: 'github', url: 'https://github.com/johndoe/portfolio', label: 'Source' }
        ]
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log('Created sample projects');

    // Create sample work experience
    const workExperience = [
      {
        user: sampleUser._id,
        company: 'TechCorp Solutions',
        position: 'Senior Full Stack Developer',
        location: 'San Francisco, CA',
        startDate: new Date('2022-03-01'),
        current: true,
        description: 'Leading development of scalable web applications using modern JavaScript frameworks and cloud technologies.',
        responsibilities: [
          'Architect and develop full-stack web applications using React, Node.js, and MongoDB',
          'Lead a team of 4 junior developers and conduct code reviews',
          'Implement CI/CD pipelines and deployment strategies using Docker and AWS',
          'Collaborate with product managers and designers to deliver user-centric solutions',
          'Optimize application performance and implement security best practices'
        ],
        achievements: [
          'Reduced application load time by 40% through code optimization and caching strategies',
          'Successfully launched 3 major product features serving 10,000+ users',
          'Mentored 2 junior developers who were promoted to mid-level positions',
          'Implemented automated testing suite increasing code coverage to 85%'
        ],
        skills: ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Leadership'],
        employmentType: 'full-time'
      },
      {
        user: sampleUser._id,
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        location: 'Remote',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2022-02-28'),
        current: false,
        description: 'Developed and maintained web applications for a fast-growing fintech startup.',
        responsibilities: [
          'Built responsive web applications using React and Express.js',
          'Designed and implemented RESTful APIs for mobile and web clients',
          'Worked closely with the founding team to define product requirements',
          'Implemented user authentication and authorization systems',
          'Performed database design and optimization for PostgreSQL'
        ],
        achievements: [
          'Developed the core platform that acquired 1,000+ users in the first 6 months',
          'Reduced API response time by 60% through database optimization',
          'Implemented real-time notifications system using WebSockets',
          'Contributed to securing $2M in Series A funding through product demos'
        ],
        skills: ['JavaScript', 'React.js', 'Node.js', 'PostgreSQL', 'Express.js'],
        employmentType: 'full-time'
      },
      {
        user: sampleUser._id,
        company: 'Freelance',
        position: 'Web Developer',
        location: 'Remote',
        startDate: new Date('2019-01-01'),
        endDate: new Date('2020-05-31'),
        current: false,
        description: 'Provided web development services to small businesses and startups.',
        responsibilities: [
          'Developed custom websites and web applications for clients',
          'Provided technical consulting and project planning services',
          'Maintained and updated existing client websites',
          'Implemented e-commerce solutions using various platforms'
        ],
        achievements: [
          'Successfully delivered 15+ projects on time and within budget',
          'Maintained 100% client satisfaction rate',
          'Generated $50K+ in revenue over 18 months',
          'Built long-term relationships with 5 recurring clients'
        ],
        skills: ['JavaScript', 'HTML5', 'CSS3', 'WordPress', 'PHP'],
        employmentType: 'freelance'
      }
    ];

    const createdWork = await Work.insertMany(workExperience);
    console.log('Created sample work experience');

    // Create sample links
    const links = [
      {
        user: sampleUser._id,
        platform: 'github',
        url: 'https://github.com/johndoe',
        label: 'My GitHub Profile',
        description: 'Check out my open source projects and contributions',
        isPublic: true,
        order: 1
      },
      {
        user: sampleUser._id,
        platform: 'linkedin',
        url: 'https://linkedin.com/in/johndoe',
        label: 'Professional Profile',
        description: 'Connect with me on LinkedIn',
        isPublic: true,
        order: 2
      },
      {
        user: sampleUser._id,
        platform: 'portfolio',
        url: 'https://johndoe-portfolio.netlify.app',
        label: 'Personal Portfolio',
        description: 'My personal portfolio website',
        isPublic: true,
        order: 3
      },
      {
        user: sampleUser._id,
        platform: 'twitter',
        url: 'https://twitter.com/johndoe_dev',
        label: 'Twitter',
        description: 'Follow me for tech updates and insights',
        isPublic: true,
        order: 4
      },
      {
        user: sampleUser._id,
        platform: 'medium',
        url: 'https://medium.com/@johndoe',
        label: 'Tech Blog',
        description: 'Read my articles about web development',
        isPublic: true,
        order: 5
      },
      {
        user: sampleUser._id,
        platform: 'stackoverflow',
        url: 'https://stackoverflow.com/users/123456/johndoe',
        label: 'Stack Overflow',
        description: 'My contributions to the developer community',
        isPublic: true,
        order: 6
      }
    ];

    const createdLinks = await Link.insertMany(links);
    console.log('Created sample links');

    // Create sample profile
    const profile = new Profile({
      user: sampleUser._id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      title: 'Senior Full Stack Developer',
      bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in JavaScript, React, Node.js, and cloud technologies. Love mentoring junior developers and contributing to open source projects in MY-API-PLAYGROUND.',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      website: 'https://johndoe-my-api-playground.netlify.app',
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: new Date('2015-08-01'),
          endDate: new Date('2019-05-15'),
          current: false,
          description: 'Graduated Magna Cum Laude with focus on software engineering and algorithms'
        },
        {
          institution: 'FreeCodeCamp',
          degree: 'Full Stack Web Development',
          field: 'Web Development',
          startDate: new Date('2019-01-01'),
          endDate: new Date('2019-06-30'),
          current: false,
          description: 'Completed comprehensive curriculum covering front-end and back-end technologies'
        }
      ],
      skills: createdSkills.map(skill => skill._id),
      projects: createdProjects.map(project => project._id),
      work: createdWork.map(work => work._id),
      links: createdLinks.map(link => link._id)
    });

    await profile.save();
    console.log('Created sample profile');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample user credentials:');
    console.log('Email: john.doe@example.com');
    console.log('Password: password123');
    console.log('\nYou can now start the MY-API-PLAYGROUND application and login with these credentials.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedDatabase();
