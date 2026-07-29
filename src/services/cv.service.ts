import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';
import { AboutResponse, ExperienceResponse, WorkExperienceItem } from '../types/index.js';

export function parseProfessionalSummary(): AboutResponse {
  const cvPath = path.join(config.paths.docs, 'cv.md');
  const cvContent = fs.readFileSync(cvPath, 'utf-8');

  const lines = cvContent.split('\n');
  let inSummary = false;
  const summaryLines: string[] = [];
  let name = 'David Sabalete Rodríguez';
  let title = 'Senior Full Stack Developer';
  let location = 'Barcelona, Spain · Remote';

  for (const line of lines) {
    if (line.startsWith('# ')) {
      name = line.replace('# ', '').trim();
      continue;
    }
    if (line.startsWith('**') && line.includes('|')) {
      const parts = line.split('|');
      if (parts[0].includes('Senior')) {
        title = parts[0].replace(/\*\*/g, '').trim();
        location = parts[1].trim();
      }
      continue;
    }
    if (line === '## Professional Summary') {
      inSummary = true;
      continue;
    }
    if (inSummary && line.startsWith('## ')) {
      break;
    }
    if (inSummary && line.trim() && line !== '---') {
      summaryLines.push(line.trim());
    }
  }

  const highlights = summaryLines
    .filter(l => l.length > 0)
    .map(l => l.replace(/^\d+\.\s*/, ''));

  return {
    name,
    title,
    location,
    summary: summaryLines.join(' '),
    highlights,
  };
}

export function parseWorkExperience(): ExperienceResponse {
  const cvPath = path.join(config.paths.docs, 'cv.md');
  const cvContent = fs.readFileSync(cvPath, 'utf-8');

  const lines = cvContent.split('\n');
  let inExperience = false;
  const experiences: WorkExperienceItem[] = [];
  let currentExp: Partial<WorkExperienceItem> = {};
  let inDescription = false;

  for (const line of lines) {
    if (line === '## Work Experience') {
      inExperience = true;
      continue;
    }
    if (inExperience && line.startsWith('## ')) {
      break;
    }
    if (!inExperience) continue;

    if (line.startsWith('### ')) {
      if (currentExp.role && currentExp.company) {
        experiences.push(currentExp as WorkExperienceItem);
      }
      currentExp = {
        role: line.replace('### ', '').trim(),
        company: '',
        period: '',
        achievements: [],
      };
      inDescription = false;
      continue;
    }

    if (line.includes('**') && (line.includes('—') || line.includes('–'))) {
      const cleanLine = line.replace(/\*\*/g, '');
      const dashIndex = cleanLine.search(/[—–]/);
      currentExp.company = cleanLine.slice(0, dashIndex).trim();
      currentExp.period = cleanLine.slice(dashIndex + 1).trim();
      inDescription = true;
      continue;
    }

    if (inDescription && line.startsWith('- ')) {
      currentExp.achievements?.push(line.replace('- ', '').trim());
      continue;
    }
  }

  if (currentExp.role && currentExp.company) {
    experiences.push(currentExp as WorkExperienceItem);
  }

  return { experience: experiences };
}
