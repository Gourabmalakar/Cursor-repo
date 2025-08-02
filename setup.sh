#!/bin/bash
echo "🚀 Setting up CV to Webpage Builder..."

# Create directory structure
mkdir -p client/src/components client/src/context client/src/services client/public
mkdir -p server

# Create root package.json
cat > package.json << 'EOF'
{
  "name": "cv-to-webpage-builder",
  "version": "1.0.0",
  "description": "A web application to create personalized webpages from CV uploads",
  "main": "server/index.js",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "build": "cd client && npm run build",
    "install-deps": "npm install && cd client && npm install && cd ../server && npm install"
  },
  "keywords": ["cv", "resume", "webpage", "builder", "portfolio"],
  "author": "CV Webpage Builder",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# Create README.md
cat > README.md << 'EOF'
# CV to Webpage Builder

A modern web application that transforms your CV/resume into a beautiful, responsive personal webpage.

## Quick Start

1. Install dependencies: `npm run install-deps`
2. Start the app: `npm run dev`
3. Open http://localhost:3000

## Features

- Upload CV in PDF/Word/Text format
- Automatic data extraction and parsing
- Multiple professional templates
- Real-time customization and preview
- Mobile responsive design
- Download ready-to-host webpage

## Usage

1. Upload your CV file
2. Edit extracted information
3. Choose template and customize
4. Preview and download
EOF

# Create sample CV
cat > sample-cv.txt << 'EOF'
John Smith
Senior Software Engineer

Email: john.smith@email.com
Phone: +1 (555) 123-4567
Address: San Francisco, CA, USA

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years of expertise in full-stack development, system architecture, and team leadership.

WORK EXPERIENCE

Senior Software Engineer | TechCorp Inc.
June 2020 - Present
• Led development of microservices architecture serving 1M+ users
• Mentored 5 junior developers and established coding standards

Software Engineer | StartupXYZ
January 2018 - May 2020
• Developed RESTful APIs and responsive web applications
• Implemented automated testing resulting in 95% code coverage

EDUCATION

Bachelor of Science in Computer Science
Stanford University | 2016

SKILLS
JavaScript, TypeScript, React, Node.js, Python, Java, SQL, MongoDB, PostgreSQL, AWS, Docker, Git

PROJECTS

E-commerce Platform
2021
• Built full-stack e-commerce application with React and Node.js
• Implemented payment processing with Stripe integration
EOF

echo "✅ Project structure created!"
echo "📝 Next steps:"
echo "1. Run: chmod +x setup.sh && ./setup.sh"
echo "2. Run: npm run install-deps"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"