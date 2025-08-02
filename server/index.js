const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// CV Parser utility functions
class CVParser {
  static extractSections(text) {
    const sections = {
      name: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    };

    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = text.match(emailRegex);
    if (emailMatch) sections.email = emailMatch[0];

    // Extract phone
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{7,15}/;
    const phoneMatch = text.match(phoneRegex);
    if (phoneMatch) sections.phone = phoneMatch[0];

    // Extract name (first few words before email/phone or at the beginning)
    const lines = text.split('\n').filter(line => line.trim());
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line && !emailRegex.test(line) && !phoneRegex.test(line) && line.length < 50) {
        if (!sections.name || line.length > sections.name.length) {
          sections.name = line;
        }
      }
    }

    // Extract sections using keyword matching
    const sectionKeywords = {
      experience: ['experience', 'work history', 'employment', 'career', 'professional experience'],
      education: ['education', 'academic', 'qualifications', 'degree', 'university', 'school'],
      skills: ['skills', 'technical skills', 'competencies', 'expertise', 'technologies'],
      projects: ['projects', 'portfolio', 'work samples'],
      summary: ['summary', 'profile', 'objective', 'about', 'overview']
    };

    const textLower = text.toLowerCase();
    
    // Extract skills (look for common patterns)
    const skillPatterns = [
      /(?:skills?|technologies?|tools?)[:\s]*([^\n]+)/gi,
      /(?:proficient in|experienced with|knowledge of)[:\s]*([^\n]+)/gi
    ];
    
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const skillText = match.split(':').slice(1).join(':').trim();
          if (skillText) {
            const skills = skillText.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 1);
            sections.skills.push(...skills);
          }
        });
      }
    });

    // Remove duplicates from skills
    sections.skills = [...new Set(sections.skills)];

    return sections;
  }

  static async parseFile(filePath, fileType) {
    try {
      let text = '';

      switch (fileType) {
        case '.pdf':
          const pdfBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          text = pdfData.text;
          break;

        case '.docx':
        case '.doc':
          const result = await mammoth.extractRawText({ path: filePath });
          text = result.value;
          break;

        case '.txt':
          text = await fs.readFile(filePath, 'utf8');
          break;

        default:
          throw new Error('Unsupported file type');
      }

      return this.extractSections(text);
    } catch (error) {
      console.error('Error parsing file:', error);
      throw error;
    }
  }
}

// Routes
app.post('/api/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const cvData = await CVParser.parseFile(req.file.path, fileExt);

    // Clean up uploaded file
    await fs.remove(req.file.path);

    res.json({
      success: true,
      data: cvData,
      message: 'CV parsed successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process CV file' });
  }
});

// Generate webpage from CV data
app.post('/api/generate-webpage', async (req, res) => {
  try {
    const { cvData, template, customizations } = req.body;
    
    if (!cvData) {
      return res.status(400).json({ error: 'CV data is required' });
    }

    const webpageId = 'webpage-' + Date.now();
    const webpageDir = path.join(__dirname, 'generated', webpageId);
    await fs.ensureDir(webpageDir);

    // Generate HTML based on template
    const html = generateWebpageHTML(cvData, template || 'modern', customizations);
    
    // Write HTML file
    await fs.writeFile(path.join(webpageDir, 'index.html'), html);
    
    // Copy CSS and assets if needed
    await copyTemplateAssets(template || 'modern', webpageDir);

    res.json({
      success: true,
      webpageId: webpageId,
      previewUrl: `/api/preview/${webpageId}`,
      message: 'Webpage generated successfully'
    });
  } catch (error) {
    console.error('Generate webpage error:', error);
    res.status(500).json({ error: 'Failed to generate webpage' });
  }
});

// Preview generated webpage
app.get('/api/preview/:webpageId', async (req, res) => {
  try {
    const webpageId = req.params.webpageId;
    const htmlPath = path.join(__dirname, 'generated', webpageId, 'index.html');
    
    if (await fs.pathExists(htmlPath)) {
      const html = await fs.readFile(htmlPath, 'utf8');
      res.send(html);
    } else {
      res.status(404).json({ error: 'Webpage not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to load preview' });
  }
});

// Download generated webpage as ZIP
app.get('/api/download/:webpageId', async (req, res) => {
  try {
    const webpageId = req.params.webpageId;
    const webpageDir = path.join(__dirname, 'generated', webpageId);
    
    if (!(await fs.pathExists(webpageDir))) {
      return res.status(404).json({ error: 'Webpage not found' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${webpageId}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    archive.directory(webpageDir, false);
    await archive.finalize();
  } catch (error) {
    res.status(500).json({ error: 'Failed to create download' });
  }
});

// Get available templates
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, modern design with sidebar layout',
      preview: '/templates/modern/preview.jpg'
    },
    {
      id: 'classic',
      name: 'Classic Elegant',
      description: 'Traditional layout with serif fonts',
      preview: '/templates/classic/preview.jpg'
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      description: 'Colorful design for creative professionals',
      preview: '/templates/creative/preview.jpg'
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple, distraction-free design',
      preview: '/templates/minimal/preview.jpg'
    }
  ];
  
  res.json({ templates });
});

// Utility functions
function generateWebpageHTML(cvData, template, customizations = {}) {
  const templates = {
    modern: generateModernTemplate,
    classic: generateClassicTemplate,
    creative: generateCreativeTemplate,
    minimal: generateMinimalTemplate
  };

  const templateFunction = templates[template] || templates.modern;
  return templateFunction(cvData, customizations);
}

function generateModernTemplate(cvData, customizations) {
  const primaryColor = customizations.primaryColor || '#3b82f6';
  const accentColor = customizations.accentColor || '#1e40af';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cvData.name || 'Professional Portfolio'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        
        .sidebar {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            height: fit-content;
        }
        
        .main-content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .profile-section {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
            font-weight: bold;
        }
        
        .name {
            font-size: 28px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 10px;
        }
        
        .contact-info {
            margin-bottom: 30px;
        }
        
        .contact-item {
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .contact-item:last-child {
            border-bottom: none;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid ${primaryColor};
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background: ${primaryColor};
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .experience-item, .education-item {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .experience-item:last-child, .education-item:last-child {
            border-bottom: none;
        }
        
        .item-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        
        .item-subtitle {
            color: ${primaryColor};
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .item-date {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .summary {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid ${primaryColor};
        }
        
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                padding: 15px;
                gap: 20px;
            }
            
            .name {
                font-size: 24px;
            }
            
            .profile-image {
                width: 120px;
                height: 120px;
                font-size: 36px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <aside class="sidebar">
            <div class="profile-section">
                <div class="profile-image">
                    ${cvData.name ? cvData.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <h1 class="name">${cvData.name || 'Professional Name'}</h1>
            </div>
            
            <div class="contact-info">
                <h2 class="section-title">Contact</h2>
                ${cvData.email ? `<div class="contact-item">📧 ${cvData.email}</div>` : ''}
                ${cvData.phone ? `<div class="contact-item">📱 ${cvData.phone}</div>` : ''}
                ${cvData.address ? `<div class="contact-item">📍 ${cvData.address}</div>` : ''}
            </div>
            
            ${cvData.skills && cvData.skills.length > 0 ? `
            <div class="skills-section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-list">
                    ${cvData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </aside>
        
        <main class="main-content">
            ${cvData.summary ? `
            <section class="summary-section">
                <h2 class="section-title">Professional Summary</h2>
                <div class="summary">${cvData.summary}</div>
            </section>
            ` : ''}
            
            ${cvData.experience && cvData.experience.length > 0 ? `
            <section class="experience-section">
                <h2 class="section-title">Experience</h2>
                ${cvData.experience.map(exp => `
                    <div class="experience-item">
                        <h3 class="item-title">${exp.position || 'Position'}</h3>
                        <div class="item-subtitle">${exp.company || 'Company'}</div>
                        <div class="item-date">${exp.duration || exp.date || ''}</div>
                        ${exp.description ? `<p>${exp.description}</p>` : ''}
                    </div>
                `).join('')}
            </section>
            ` : ''}
            
            ${cvData.education && cvData.education.length > 0 ? `
            <section class="education-section">
                <h2 class="section-title">Education</h2>
                ${cvData.education.map(edu => `
                    <div class="education-item">
                        <h3 class="item-title">${edu.degree || 'Degree'}</h3>
                        <div class="item-subtitle">${edu.school || 'Institution'}</div>
                        <div class="item-date">${edu.year || edu.duration || ''}</div>
                    </div>
                `).join('')}
            </section>
            ` : ''}
            
            ${cvData.projects && cvData.projects.length > 0 ? `
            <section class="projects-section">
                <h2 class="section-title">Projects</h2>
                ${cvData.projects.map(project => `
                    <div class="experience-item">
                        <h3 class="item-title">${project.name || 'Project'}</h3>
                        <div class="item-date">${project.date || ''}</div>
                        ${project.description ? `<p>${project.description}</p>` : ''}
                    </div>
                `).join('')}
            </section>
            ` : ''}
        </main>
    </div>
</body>
</html>`;
}

function generateClassicTemplate(cvData, customizations) {
  // Similar structure but with classic styling
  return generateModernTemplate(cvData, { ...customizations, primaryColor: '#2c3e50', accentColor: '#34495e' });
}

function generateCreativeTemplate(cvData, customizations) {
  // Creative colorful template
  return generateModernTemplate(cvData, { ...customizations, primaryColor: '#e74c3c', accentColor: '#f39c12' });
}

function generateMinimalTemplate(cvData, customizations) {
  // Minimal black and white template
  return generateModernTemplate(cvData, { ...customizations, primaryColor: '#000000', accentColor: '#333333' });
}

async function copyTemplateAssets(template, destinationDir) {
  // In a real implementation, you'd copy CSS, JS, and image files
  // For now, everything is inline in the HTML
  return Promise.resolve();
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CV to Webpage Builder API is ready!`);
});