const mongoose = require('mongoose');
const moduleSchema= new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
     // ---------- MODULE 1 ----------
  drivingPosition: {
    seatAndSeatbelt: { type: Boolean, default: false },
    controlsAndInstruments: { type: Boolean, default: false },
  },

  // ---------- MODULE 2 ----------
  basicManeuvering: {
    startingAndStopping: { type: Boolean, default: false },
    slowDrivingAndSteering: { type: Boolean, default: false },
  },

  // ---------- MODULE 3 ----------
  gearShifting: {
    upshifting: { type: Boolean, default: false },
    braking: { type: Boolean, default: false },
    downshifting: { type: Boolean, default: false },
  },

  // ---------- MODULE 4 ----------
  slopes: {
    uphill: { type: Boolean, default: false },
    downhill: { type: Boolean, default: false },
  },

  // ---------- MODULE 5 ----------
  maneuvering: {
    reversing: { type: Boolean, default: false },
    turningAround: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
  },

  // ---------- MODULE 6 ----------
  functionAndInspection: {
    theCar: { type: Boolean, default: false },
    loadAndPassengers: { type: Boolean, default: false },
    trailer: { type: Boolean, default: false },
    safetyCheck: { type: Boolean, default: false },
  },

  // ---------- MODULE 7 ----------
  coordinationAndBraking: {
    observationAndRiskAssessment: { type: Boolean, default: false },
    coordinationAndMotorControl: { type: Boolean, default: false },
    acceleration: { type: Boolean, default: false },
    hardBraking: { type: Boolean, default: false },
  },

  // ---------- MODULE 8 ----------
  residentialAreas: {
    observationAndRiskAssessment: { type: Boolean, default: false },
    speedAdjustment: { type: Boolean, default: false },
    positioning: { type: Boolean, default: false },
    rightOfWayRules: { type: Boolean, default: false },
  },

  // ---------- MODULE 9 ----------
  minorCountryRoads: {
    observationAndRiskAssessment: { type: Boolean, default: false },
    speedAdjustment: { type: Boolean, default: false },
    positioning: { type: Boolean, default: false },
    rightOfWayRules: { type: Boolean, default: false },
    railwayCrossing: { type: Boolean, default: false },
  },

  // ---------- MODULE 10 ----------
  cityDriving: {
    observationAndRiskAssessment: { type: Boolean, default: false },
    speedAdjustment: { type: Boolean, default: false },
    positioning: { type: Boolean, default: false },
    rightOfWayRules: { type: Boolean, default: false },
    trafficSignals: { type: Boolean, default: false },
    oneWayStreet: { type: Boolean, default: false },
    roundabout: { type: Boolean, default: false },
    turningAroundAndParking: { type: Boolean, default: false },
  },

  // ---------- MODULE 11 ----------
  ruralRoads: {
    observationAndRiskAssessment: { type: Boolean, default: false },
    speedAdjustment: { type: Boolean, default: false },
    positioning: { type: Boolean, default: false },
    entryAndExit: { type: Boolean, default: false },
    overtaking: { type: Boolean, default: false },
    turningAroundAndParking: { type: Boolean, default: false },
  },

  // ---------- MODULE 12 ----------
  highSpeedRoads: {
    observationAndRiskAssessment: { type: Boolean, default: false },
    speedAdjustment: { type: Boolean, default: false },
    motorway: { type: Boolean, default: false },
    expressway: { type: Boolean, default: false },
    dividedRoad: { type: Boolean, default: false },
  },

  // ---------- MODULE 13 ----------
  nightDriving: {
    observationAndRiskAssessment: { type: Boolean, default: false },
    speedAdjustment: { type: Boolean, default: false },
    nightDrivingDemo: { type: Boolean, default: false },
    meetingTraffic: { type: Boolean, default: false },
    overtaking: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    reducedVisibility: { type: Boolean, default: false },
  },

  // ---------- MODULE 14 ----------
  slipperyRoadConditions: {
    slipperySurfaces: { type: Boolean, default: false },
    driverAssistSystems: { type: Boolean, default: false },
  },

  // ---------- MODULE 15 ----------
  finalEducationControl: {
    finalAssessment: { type: Boolean, default: false },
  },
  },
  {
    timestamps: true,
  },
);

moduleSchema.set('toJSON', {
  getters: true,
  virtuals: false,
  transform: (doc, ret, options) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Module', moduleSchema);
