const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ===== USER =====
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee', 'citizen'], default: 'employee' },
  phone: String,
  department: { type: String, default: 'Sustainability' },
  skills: [String],
  experience: String,
  ecoScore: { type: Number, default: 70 },
  co2Saved: { type: Number, default: 0 },
  badges: [String],
  city: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (pw) {
  return bcrypt.compare(pw, this.password);
};

// ===== TASK =====
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'overdue'], default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline: Date,
  city: String,
  region: String,
  passkey: String,
  progress: { type: Number, default: 0 },
  co2Target: { type: Number, default: 0 },
  co2Saved: { type: Number, default: 0 },
  ecoReason: String,
  aiAnalysis: mongoose.Schema.Types.Mixed,
  requiredSkills: [String],
  expectedOutput: String,
  sustainabilityType: {
    type: String,
    enum: ['hybrid-work', 'solar-scheduling', 'traffic-optimization', 'industrial-alert', 'climate-preparedness', 'urban-air', 'general'],
    default: 'general'
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

// ===== NOTIFICATION =====
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  type: { type: String, enum: ['task', 'alert', 'report', 'system', 'registration'], default: 'system' },
  city: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// ===== EMISSION LOG =====
const emissionLogSchema = new mongoose.Schema({
  city: String,
  value: Number,
  type: String,
  timestamp: { type: Date, default: Date.now },
  source: String,
});


const otpSessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: { type: String, enum: ['register', 'login', 'forgot'], default: 'register' },
  otp: { type: String, required: true },
  payload: mongoose.Schema.Types.Mixed,
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const citizenDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
  city: String,
  familyMembers: Number,
  vehicles: Number,
  twoWheelers: Number,
  energyType: String,
  alertPreference: String,
  fuelType: String,
  dailyTravelKm: Number,
  electricityUsage: Number,
  solarPanel: Boolean,
  estimatedMobilityCO2: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ===== DISEASE PREDICTION =====
const diseasePredictionSchema = new mongoose.Schema({
  category: { type: String, enum: ['human', 'crop'], required: true },
  diseaseId: { type: String, required: true },
  diseaseName: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, default: 'Vietnam' },
  horizonDays: { type: Number, default: 30 },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], required: true },
  confidence: { type: Number, required: true },
  modelMetrics: {
    accuracy: Number,
    precision: Number,
    recall: Number,
    f1Score: Number,
    rocAuc: Number,
    modelName: String,
    validationDataset: String,
    sampleSize: Number,
  },
  environmentalInputs: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    aqi: Number,
    pm25: Number,
    floodRisk: Number,
    soilMoisture: Number,
    cropStage: String,
    populationDensity: Number,
  },
  forecastTimeline: [
    {
      day: Number,
      date: String,
      expected: Number,
      lowerBound: Number,
      upperBound: Number,
      mitigatedExpected: Number,
      riskIndex: Number,
      spreadFactor: Number,
    }
  ],
  causalAnalysis: {
    primaryDrivers: [String],
    factorWeights: [
      { factor: String, weight: Number, impact: String, currentValue: String }
    ],
    summary: String,
    evidenceLevel: String,
  },
  solutions: {
    primaryInterventions: [
      { title: String, description: String, timeframe: String, expectedReduction: String, urgency: String }
    ],
    alternativeMeasures: [
      { title: String, description: String, tradeOff: String }
    ],
    preventionProtocols: [String],
    responsibleGuidance: String,
  },
  cityAlgorithm: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['active', 'monitoring', 'resolved', 'alert_dispatched'], default: 'active' },
  alertDispatched: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const EmissionLog = mongoose.model('EmissionLog', emissionLogSchema);
const CitizenData = mongoose.model('CitizenData', citizenDataSchema);
const OtpSession = mongoose.model('OtpSession', otpSessionSchema);
const DiseasePrediction = mongoose.model('DiseasePrediction', diseasePredictionSchema);

module.exports = { User, Task, Notification, EmissionLog, CitizenData, OtpSession, DiseasePrediction };
