/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Categories of stadium zones for crowd segmentation.
 */
export type ZoneCategory = 'stand' | 'gate' | 'pitch' | 'concourse' | 'parking' | 'amenity';

/**
 * Urgency/congestion threat levels.
 */
export type DangerLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Types of hazards or incidents reported in the command system.
 */
export type IncidentType = 'medical' | 'fire' | 'security' | 'structural' | 'overcrowding';

/**
 * Severity indices for incidents to drive emergency triage.
 */
export type SeverityLevel = 'minor' | 'moderate' | 'major' | 'critical';

/**
 * Resolution state machine for stadium incidents.
 */
export type IncidentStatus = 'reported' | 'dispatched' | 'resolving' | 'resolved';

/**
 * Color blindness mode filters.
 */
export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'achromatopsia';

/**
 * Represents a logical sub-section/zone of the Cricket Stadium.
 */
export interface StadiumZone {
  id: string;
  name: string;
  category: ZoneCategory;
  capacity: number;
  currentCount: number;
  throughputRate: number; // people entered/exited per minute
  maxThroughputRate: number; // maximum safe design throughput (peop/min)
  dangerLevel: DangerLevel;
  tags?: string[];
  coordinateX: number; // percentage coordinate on visualization X
  coordinateY: number; // percentage coordinate on visualization Y
}

/**
 * Represents an active security, safety, or logistical incident.
 */
export interface StadiumIncident {
  id: string;
  title: string;
  type: IncidentType;
  severity: SeverityLevel;
  description: string;
  zoneId: string;
  status: IncidentStatus;
  timestamp: string; // ISO 8601 string
  assignedStaff: string[]; // e.g., ["Volunteers Group 4", "Medical Squad B"]
}

/**
 * Represents an automated routing alternative structure calculated for bottlenecks.
 */
export interface RouteInstruction {
  id: string;
  sourceZoneId: string;
  destinationZoneId: string;
  currentStatus: 'active' | 'standby';
  description: string;
  divertedFlow: number; // percentage of crowd redirected
  safetyRating: number; // calculated routing rating out of 100
}

/**
 * AI-powered critical crowd advice generated from Gemini API.
 */
export interface AICrowdAdvice {
  id: string;
  bottleneckLocation: string;
  tacticalPlan: string;
  suggestedAction: string;
  urgencyScore: number; // 0-100 scale index
  timestamp: string;
}

/**
 * Real-time event notifications displayed to operators.
 */
export interface StadiumNotification {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'ai';
  timestamp: string;
}

/**
 * User interface configuration for accessible crowd displays (DEI-focused).
 */
export interface AccessibilitySettings {
  textScale: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  colorBlindMode: ColorBlindMode;
  screenReaderActive: boolean;
  audioPings: boolean;
}

/**
 * Historical metric coordinates used for trend analysis.
 */
export interface TimepointMetric {
  timeLabel: string; // e.g., "18:00"
  attendanceCount: number;
  gateThroughputSpeed: number;
  incidentCountValue: number;
}
