import { Request, Response } from 'express';
import { AboutResponse, ExperienceResponse, HealthResponse } from '../types/index.js';
import { parseProfessionalSummary, parseWorkExperience } from '../services/cv.service.js';
import pkg from '../../package.json' with { type: 'json' };

export const health = (_req: Request, res: Response<HealthResponse>) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: pkg.version });
};

export const about = (_req: Request, res: Response<AboutResponse>) => {
  const about = parseProfessionalSummary();
  res.json(about);
};

export const experience = (_req: Request, res: Response<ExperienceResponse>) => {
  const experience = parseWorkExperience();
  res.json(experience);
};
