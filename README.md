# CV to Webpage Builder

A modern web application that transforms your CV/resume into a beautiful, responsive personal webpage. Upload your CV in PDF, Word, or text format and instantly generate a professional website that showcases your skills and experience.

## ✨ Features

- 📄 **Multi-format Support**: Upload CVs in PDF, Word (.doc/.docx), or text formats
- 🤖 **Intelligent Parsing**: Advanced CV parsing with automatic data extraction
- 🎨 **Beautiful Templates**: Choose from multiple professionally designed templates
- 🎯 **Customization**: Personalize colors, fonts, and styling
- 📱 **Responsive Design**: Perfect display on desktop, tablet, and mobile devices
- ✏️ **In-app Editing**: Edit and refine your information directly in the app
- 👀 **Live Preview**: Real-time preview of your webpage
- 📦 **Easy Export**: Download your complete webpage as a ZIP file
- 🚀 **Hosting Ready**: Ready to deploy on any hosting platform

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cv-to-webpage-builder
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
cv-to-webpage-builder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Global state management
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── uploads/           # Temporary file storage
│   └── generated/         # Generated webpages
└── package.json           # Root package.json
```

## 🎯 How to Use

### 1. Upload Your CV
- Drag and drop your CV file or click to browse
- Supported formats: PDF, Word documents (.doc, .docx), and text files
- Maximum file size: 10MB

### 2. Edit Your Information
- Review and edit the automatically extracted information
- Add or modify sections:
  - Personal Information
  - Work Experience
  - Education
  - Skills
  - Projects

### 3. Choose Template & Customize
- Select from multiple professional templates:
  - **Modern Professional**: Clean, modern design with sidebar layout
  - **Classic Elegant**: Traditional layout with serif fonts
  - **Creative Portfolio**: Colorful design for creative professionals
  - **Minimal Clean**: Simple, distraction-free design
- Customize colors and fonts to match your style

### 4. Preview & Download
- Preview your webpage in real-time
- Test responsive design on different device sizes
- Download as a ZIP file containing all necessary files
- Deploy to your preferred hosting platform

## 🎨 Templates

### Modern Professional
- Sidebar layout with profile section
- Grid-based content organization
- Modern typography and spacing
- Blue color scheme (customizable)

### Classic Elegant
- Traditional top-to-bottom layout
- Serif fonts for a professional look
- Conservative color palette
- Suitable for corporate environments

### Creative Portfolio
- Vibrant and colorful design
- Creative layouts and typography
- Perfect for designers and artists
- Eye-catching visual elements

### Minimal Clean
- Simple, distraction-free design
- Focus on content readability
- Monochromatic color scheme
- Great for technical professionals

## 🔧 Customization Options

- **Primary Color**: Main accent color for headers and highlights
- **Accent Color**: Secondary color for gradients and accents
- **Font Family**: Choose from professional font options
- **Layout**: Template-specific layout customizations

## 📱 Responsive Design

All generated webpages are fully responsive and optimized for:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🚀 Deployment Options

Your generated webpage can be deployed to any hosting platform:

### Free Hosting Options
- **GitHub Pages**: Free hosting for public repositories
- **Netlify**: Drag-and-drop deployment with continuous integration
- **Vercel**: Automatic deployments with Git integration
- **Surge.sh**: Simple command-line deployment

### Setup Instructions
1. Download the ZIP file from the preview page
2. Extract the contents
3. Upload the files to your chosen hosting platform
4. Your webpage will be live at your domain!

## 🛠 Development

### Backend (Server)

The backend uses Node.js with Express and includes:
- File upload handling with Multer
- CV parsing for PDF, Word, and text files
- HTML template generation
- ZIP file creation for downloads

Key dependencies:
- `express`: Web framework
- `multer`: File upload handling
- `pdf-parse`: PDF text extraction
- `mammoth`: Word document parsing
- `archiver`: ZIP file creation

### Frontend (Client)

The frontend is built with React and includes:
- Modern React with hooks
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication
- React Hot Toast for notifications

Key dependencies:
- `react`: UI framework
- `tailwindcss`: Utility-first CSS framework
- `react-router-dom`: Client-side routing
- `axios`: HTTP client
- `react-dropzone`: File upload component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

Please use the GitHub Issues tab to report bugs or request new features.

## 📞 Support

If you need help or have questions:
1. Check the documentation above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Built with ❤️ for creating beautiful professional websites from CVs**
