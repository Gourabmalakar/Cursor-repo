import React, { useState } from 'react';
import { Plus, Trash2, Save, User, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

function CVEditor() {
  const { state, actions } = useApp();
  const [activeSection, setActiveSection] = useState('personal');

  if (!state.cvData) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">Please upload a CV first to start editing.</p>
      </div>
    );
  }

  const handleFieldUpdate = (field, value) => {
    actions.updateCVField(field, value);
    toast.success('Changes saved automatically');
  };

  const handleAddItem = (section) => {
    const newItem = getNewItemTemplate(section);
    actions.addCVItem(section, newItem);
    toast.success('New item added');
  };

  const handleRemoveItem = (section, index) => {
    actions.removeCVItem(section, index);
    toast.success('Item removed');
  };

  const getNewItemTemplate = (section) => {
    switch (section) {
      case 'experience':
        return { position: '', company: '', duration: '', description: '' };
      case 'education':
        return { degree: '', school: '', year: '', description: '' };
      case 'projects':
        return { name: '', date: '', description: '', technologies: '' };
      case 'certifications':
        return { name: '', issuer: '', date: '', description: '' };
      default:
        return {};
    }
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'experience', name: 'Experience', icon: null },
    { id: 'education', name: 'Education', icon: null },
    { id: 'skills', name: 'Skills', icon: null },
    { id: 'projects', name: 'Projects', icon: null },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="p-6">
        {activeSection === 'personal' && (
          <PersonalInfoSection cvData={state.cvData} onUpdate={handleFieldUpdate} />
        )}
        {activeSection === 'experience' && (
          <ExperienceSection 
            experience={state.cvData.experience || []} 
            onAdd={() => handleAddItem('experience')}
            onRemove={(index) => handleRemoveItem('experience', index)}
            onUpdate={handleFieldUpdate}
          />
        )}
        {activeSection === 'education' && (
          <EducationSection 
            education={state.cvData.education || []} 
            onAdd={() => handleAddItem('education')}
            onRemove={(index) => handleRemoveItem('education', index)}
            onUpdate={handleFieldUpdate}
          />
        )}
        {activeSection === 'skills' && (
          <SkillsSection skills={state.cvData.skills || []} onUpdate={handleFieldUpdate} />
        )}
        {activeSection === 'projects' && (
          <ProjectsSection 
            projects={state.cvData.projects || []} 
            onAdd={() => handleAddItem('projects')}
            onRemove={(index) => handleRemoveItem('projects', index)}
            onUpdate={handleFieldUpdate}
          />
        )}
      </div>
    </div>
  );
}

function PersonalInfoSection({ cvData, onUpdate }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            Full Name
          </label>
          <input
            type="text"
            value={cvData.name || ''}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-1" />
            Email
          </label>
          <input
            type="email"
            value={cvData.email || ''}
            onChange={(e) => onUpdate('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-1" />
            Phone
          </label>
          <input
            type="tel"
            value={cvData.phone || ''}
            onChange={(e) => onUpdate('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Address
          </label>
          <input
            type="text"
            value={cvData.address || ''}
            onChange={(e) => onUpdate('address', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your address"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          value={cvData.summary || ''}
          onChange={(e) => onUpdate('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a brief professional summary"
        />
      </div>
    </div>
  );
}

function ExperienceSection({ experience, onAdd, onRemove, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      </div>

      {experience.map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
            <button
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={exp.position || ''}
              onChange={(e) => {
                const newExperience = [...experience];
                newExperience[index] = { ...exp, position: e.target.value };
                onUpdate('experience', newExperience);
              }}
              placeholder="Job Title"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={exp.company || ''}
              onChange={(e) => {
                const newExperience = [...experience];
                newExperience[index] = { ...exp, company: e.target.value };
                onUpdate('experience', newExperience);
              }}
              placeholder="Company"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="text"
            value={exp.duration || ''}
            onChange={(e) => {
              const newExperience = [...experience];
              newExperience[index] = { ...exp, duration: e.target.value };
              onUpdate('experience', newExperience);
            }}
            placeholder="Duration (e.g., Jan 2020 - Present)"
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={exp.description || ''}
            onChange={(e) => {
              const newExperience = [...experience];
              newExperience[index] = { ...exp, description: e.target.value };
              onUpdate('experience', newExperience);
            }}
            placeholder="Job description and achievements"
            rows={3}
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      {experience.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No work experience added yet. Click "Add Experience" to get started.
        </div>
      )}
    </div>
  );
}

function EducationSection({ education, onAdd, onRemove, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>

      {education.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
            <button
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={edu.degree || ''}
              onChange={(e) => {
                const newEducation = [...education];
                newEducation[index] = { ...edu, degree: e.target.value };
                onUpdate('education', newEducation);
              }}
              placeholder="Degree"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={edu.school || ''}
              onChange={(e) => {
                const newEducation = [...education];
                newEducation[index] = { ...edu, school: e.target.value };
                onUpdate('education', newEducation);
              }}
              placeholder="Institution"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="text"
            value={edu.year || ''}
            onChange={(e) => {
              const newEducation = [...education];
              newEducation[index] = { ...edu, year: e.target.value };
              onUpdate('education', newEducation);
            }}
            placeholder="Year (e.g., 2020)"
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No education added yet. Click "Add Education" to get started.
        </div>
      )}
    </div>
  );
}

function SkillsSection({ skills, onUpdate }) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()];
      onUpdate('skills', updatedSkills);
      setNewSkill('');
      toast.success('Skill added');
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    onUpdate('skills', updatedSkills);
    toast.success('Skill removed');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a skill"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {skill}
            <button
              onClick={() => removeSkill(index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No skills added yet. Add your technical and professional skills above.
        </div>
      )}
    </div>
  );
}

function ProjectsSection({ projects, onAdd, onRemove, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {projects.map((project, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Project #{index + 1}</h4>
            <button
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={project.name || ''}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index] = { ...project, name: e.target.value };
                onUpdate('projects', newProjects);
              }}
              placeholder="Project Name"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={project.date || ''}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index] = { ...project, date: e.target.value };
                onUpdate('projects', newProjects);
              }}
              placeholder="Date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            value={project.description || ''}
            onChange={(e) => {
              const newProjects = [...projects];
              newProjects[index] = { ...project, description: e.target.value };
              onUpdate('projects', newProjects);
            }}
            placeholder="Project description"
            rows={3}
            className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No projects added yet. Click "Add Project" to showcase your work.
        </div>
      )}
    </div>
  );
}

export default CVEditor;