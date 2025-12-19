
import { ChecklistTask, TaskCategory, User } from './types';

export const CURRENT_USER: User = {
  id: 'u-1',
  name: 'Alex Rivera',
  role: 'MANAGER'
};

export const DEFAULT_TASKS: ChecklistTask[] = [
  {
    id: 't-1',
    category: TaskCategory.TEMPERATURE,
    title: 'Walk-in Refrigerator',
    description: 'Check main walk-in temp. Target: 34°F - 40°F',
    required: true,
    type: 'TEMPERATURE',
    minTemp: 34,
    maxTemp: 40
  },
  {
    id: 't-2',
    category: TaskCategory.TEMPERATURE,
    title: 'Hot Hold Line (Soup)',
    description: 'Check internal temp of soup on hot hold. Target: >140°F',
    required: true,
    type: 'TEMPERATURE',
    minTemp: 140,
    maxTemp: 212
  },
  {
    id: 't-3',
    category: TaskCategory.CLEANING,
    title: 'Dishwasher Sanitizer Check',
    description: 'Verify chemical concentration levels using test strips.',
    required: true,
    type: 'CHECKBOX'
  },
  {
    id: 't-4',
    category: TaskCategory.OPENING,
    title: 'Dining Area Inspection',
    description: 'Floors swept, tables wiped, condiment stations restocked.',
    required: false,
    type: 'CHECKBOX'
  },
  {
    id: 't-5',
    category: TaskCategory.RECEIVING,
    title: 'Produce Delivery Inspection',
    description: 'Check for signs of pests or spoilage in morning delivery.',
    required: true,
    type: 'TEXT'
  },
  {
    id: 't-6',
    category: TaskCategory.CLOSING,
    title: 'Kitchen Floor Degreasing',
    description: 'Full scrub and squeegee of main prep area floor.',
    required: true,
    type: 'CHECKBOX'
  }
];
