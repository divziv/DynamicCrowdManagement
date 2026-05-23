/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StadiumZone, StadiumIncident, TimepointMetric } from '../types';

/**
 * Default configuration of cricket stadium zones/stands/gates.
 */
export const INITIAL_ZONES: StadiumZone[] = [
  // Stands
  {
    id: 'stand-north-l1',
    name: 'North Stand (Level 1)',
    category: 'stand',
    capacity: 8000,
    currentCount: 7850, // Close to capacity
    throughputRate: 150,
    maxThroughputRate: 200,
    dangerLevel: 'high',
    tags: ['Family Friendly', 'Alcohol-Free Zone'],
    coordinateX: 50,
    coordinateY: 18,
  },
  {
    id: 'stand-north-l2',
    name: 'North Stand (Level 2)',
    category: 'stand',
    capacity: 6500,
    currentCount: 5200,
    throughputRate: 80,
    maxThroughputRate: 150,
    dangerLevel: 'low',
    tags: ['Elevated View'],
    coordinateX: 50,
    coordinateY: 8,
  },
  {
    id: 'stand-east-l1',
    name: 'East Corporate Stand',
    category: 'stand',
    capacity: 10000,
    currentCount: 9400,
    throughputRate: 180,
    maxThroughputRate: 250,
    dangerLevel: 'medium',
    tags: ['Active Fans', 'Sunset View'],
    coordinateX: 78,
    coordinateY: 50,
  },
  {
    id: 'stand-east-l2',
    name: 'East Gallery',
    category: 'stand',
    capacity: 7000,
    currentCount: 4100,
    throughputRate: 60,
    maxThroughputRate: 140,
    dangerLevel: 'low',
    tags: ['General Admission'],
    coordinateX: 88,
    coordinateY: 50,
  },
  {
    id: 'stand-south-l1',
    name: 'South Stand (Level 1)',
    category: 'stand',
    capacity: 9000,
    currentCount: 8800, // Very crowded
    throughputRate: 210,
    maxThroughputRate: 220, // Danger limit
    dangerLevel: 'critical',
    tags: ['Fan Base Core', 'Loud Zone'],
    coordinateX: 50,
    coordinateY: 82,
  },
  {
    id: 'stand-south-l2',
    name: 'South Pavilion',
    category: 'stand',
    capacity: 5500,
    currentCount: 4800,
    throughputRate: 90,
    maxThroughputRate: 120,
    dangerLevel: 'medium',
    tags: ['Prime Sitting'],
    coordinateX: 50,
    coordinateY: 92,
  },
  {
    id: 'stand-west-club',
    name: 'Members Club Stand',
    category: 'stand',
    capacity: 6000,
    currentCount: 5400,
    throughputRate: 110,
    maxThroughputRate: 180,
    dangerLevel: 'low',
    tags: ['Restricted Access', 'Air Conditioned Boxes'],
    coordinateX: 22,
    coordinateY: 50,
  },
  {
    id: 'stand-west-l2',
    name: 'West Wing Gallery',
    category: 'stand',
    capacity: 5000,
    currentCount: 3900,
    throughputRate: 70,
    maxThroughputRate: 110,
    dangerLevel: 'low',
    tags: ['Pundits Box View'],
    coordinateX: 12,
    coordinateY: 50,
  },

  // Gates
  {
    id: 'gate-a',
    name: 'Gate A (North Entry)',
    category: 'gate',
    capacity: 4000,
    currentCount: 3880, // High stress
    throughputRate: 240,
    maxThroughputRate: 200, // Screaming bottleneck
    dangerLevel: 'critical',
    tags: ['E-Ticket Scan Enabled', 'High Density Queue'],
    coordinateX: 50,
    coordinateY: 2,
  },
  {
    id: 'gate-b',
    name: 'Gate B (East-North Entrance)',
    category: 'gate',
    capacity: 3500,
    currentCount: 1600,
    throughputRate: 90,
    maxThroughputRate: 160,
    dangerLevel: 'low',
    tags: ['Baggage Verification Centre'],
    coordinateX: 80,
    coordinateY: 22,
  },
  {
    id: 'gate-c',
    name: 'Gate C (East-South Express)',
    category: 'gate',
    capacity: 3500,
    currentCount: 1100,
    throughputRate: 70,
    maxThroughputRate: 160,
    dangerLevel: 'low',
    tags: ['Fast-track VIP RFID Lane'],
    coordinateX: 80,
    coordinateY: 78,
  },
  {
    id: 'gate-d',
    name: 'Gate D (South Entry)',
    category: 'gate',
    capacity: 5000,
    currentCount: 4500,
    throughputRate: 260,
    maxThroughputRate: 250,
    dangerLevel: 'high',
    tags: ['Accessibility Wheelchair Ramp', 'Heavy Turnstile Traffic'],
    coordinateX: 50,
    coordinateY: 98,
  },
  {
    id: 'gate-e',
    name: 'Gate E (West-South Entrance)',
    category: 'gate',
    capacity: 3000,
    currentCount: 2200,
    throughputRate: 150,
    maxThroughputRate: 150,
    dangerLevel: 'medium',
    tags: ['Media & VIP Accreditation'],
    coordinateX: 20,
    coordinateY: 78,
  },
  {
    id: 'gate-f',
    name: 'Gate F (West-North Exit)',
    category: 'gate',
    capacity: 3000,
    currentCount: 850,
    throughputRate: 40,
    maxThroughputRate: 150,
    dangerLevel: 'low',
    tags: ['Alternative Rapid Dispersal Way'],
    coordinateX: 20,
    coordinateY: 22,
  },

  // Concourse & Ground Coordinates
  {
    id: 'pitch-arena',
    name: 'Cricket Center Pitch',
    category: 'pitch',
    capacity: 200,
    currentCount: 45, // Match in progress details
    throughputRate: 0,
    maxThroughputRate: 0,
    dangerLevel: 'low',
    tags: ['Strict Restricted Core', 'Tension Grass Pitch'],
    coordinateX: 50,
    coordinateY: 50,
  },
  {
    id: 'parking-north',
    name: 'North Shuttle Parking Hub',
    category: 'parking',
    capacity: 10000,
    currentCount: 7900,
    throughputRate: 100,
    maxThroughputRate: 300,
    dangerLevel: 'medium',
    tags: ['EV Charging Available', 'Bus Drop-off Point'],
    coordinateX: 50,
    coordinateY: -8, // Outer bounds
  },
  {
    id: 'parking-south',
    name: 'Metro Southern Car Parking',
    category: 'parking',
    capacity: 12000,
    currentCount: 9100,
    throughputRate: 125,
    maxThroughputRate: 350,
    dangerLevel: 'medium',
    tags: ['Direct Metro Pedestrian Bridge Walk'],
    coordinateX: 50,
    coordinateY: 108, // Outer bounds
  }
];

/**
 * Highly realistic initial medical/security incidents reported upon loading.
 */
export const INITIAL_INCIDENTS: StadiumIncident[] = [
  {
    id: 'inc-01',
    title: 'Dehydration/Heat Triage Incident',
    type: 'medical',
    severity: 'moderate',
    description: 'An elderly cricket fan collapsed due to high humidity levels near the catering kiosk in North Stand L1.',
    zoneId: 'stand-north-l1',
    status: 'reported',
    timestamp: new Date().toISOString(),
    assignedStaff: ['Volunteers Tier-1', 'Red Cross Unit A'],
  },
  {
    id: 'inc-02',
    title: 'Gate A Scanner Turnstile Jam',
    type: 'overcrowding',
    severity: 'major',
    description: 'Three local turnstile ticket readers failed at Gate A, causing high spectator build-up on the entrance ramp.',
    zoneId: 'gate-a',
    status: 'dispatched',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    assignedStaff: ['SysOps IT Support', 'Local Police Stewards'],
  },
  {
    id: 'inc-03',
    title: 'Stairwell B Crowd Accumulation',
    type: 'security',
    severity: 'minor',
    description: 'Narrow walkway bottleneck on Level 1 South Concourse Stairwell due to a minor sponsor stand obstruction.',
    zoneId: 'stand-south-l1',
    status: 'resolving',
    timestamp: new Date(Date.now() - 40 * 60000).toISOString(),
    assignedStaff: ['Ushers Sector 4'],
  }
];

/**
 * Generates an array of highly realistic mock statistics over the last 12 match segments.
 * Illustrates pre-match entry peaks, game-time valleys, and exit flow projections.
 */
export function generateSeedHistoricalMetrics(): TimepointMetric[] {
  return [
    { timeLabel: 'H-5 Match Prep', attendanceCount: 2000, gateThroughputSpeed: 200, incidentCountValue: 0 },
    { timeLabel: 'H-4 Gates Open', attendanceCount: 8500, gateThroughputSpeed: 450, incidentCountValue: 1 },
    { timeLabel: 'H-3 Peak Surge', attendanceCount: 24500, gateThroughputSpeed: 890, incidentCountValue: 3 },
    { timeLabel: 'H-2 Dense Peak', attendanceCount: 42000, gateThroughputSpeed: 1020, incidentCountValue: 4 },
    { timeLabel: 'H-1 Anthems', attendanceCount: 58000, gateThroughputSpeed: 710, incidentCountValue: 5 },
    { timeLabel: '1st Over Bowl', attendanceCount: 65200, gateThroughputSpeed: 180, incidentCountValue: 3 },
    { timeLabel: 'Powerplay Ends', attendanceCount: 68100, gateThroughputSpeed: 80, incidentCountValue: 3 },
    { timeLabel: '10 Over Standby', attendanceCount: 69800, gateThroughputSpeed: 40, incidentCountValue: 2 },
    { timeLabel: 'Mid-Inning Break', attendanceCount: 71200, gateThroughputSpeed: 110, incidentCountValue: 4 },
    { timeLabel: 'Run Chase Start', attendanceCount: 71500, gateThroughputSpeed: 50, incidentCountValue: 3 },
    { timeLabel: 'Death Overs', attendanceCount: 71545, gateThroughputSpeed: 60, incidentCountValue: 2 },
    { timeLabel: 'Match Completed', attendanceCount: 71545, gateThroughputSpeed: 1200, incidentCountValue: 4 },
  ];
}
