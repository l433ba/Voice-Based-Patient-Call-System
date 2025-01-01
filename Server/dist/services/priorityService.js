"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDescription = exports.getPriority = void 0;
const string_similarity_1 = __importDefault(require("string-similarity"));
const diseases_1 = require("../constants/diseases");
// Common symptoms/keywords for different priority levels
const PRIORITY_KEYWORDS = {
    critical: ['heart attack', 'stroke', 'severe bleeding', 'unconscious', 'not breathing', 'chest pain'],
    high: ['fracture', 'severe pain', 'high fever', 'difficulty breathing', 'head injury'],
    medium: ['moderate pain', 'fever', 'vomiting', 'diarrhea', 'minor cuts'],
    low: ['common cold', 'minor pain', 'rash', 'cough', 'sore throat']
};
const getPriority = (disease) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Getting priority for disease:', disease);
        // First check if disease exists in predefined list
        const knownDisease = diseases_1.DISEASES.find(d => d.english.toLowerCase() === disease.toLowerCase());
        if (knownDisease) {
            console.log('Found known disease with priority:', knownDisease.priority);
            return knownDisease.priority;
        }
        // If not found, use string similarity to determine priority
        console.log('Disease not found in known list, using similarity matching...');
        const priorityScores = {
            critical: getMaxSimilarity(disease, PRIORITY_KEYWORDS.critical),
            high: getMaxSimilarity(disease, PRIORITY_KEYWORDS.high),
            medium: getMaxSimilarity(disease, PRIORITY_KEYWORDS.medium),
            low: getMaxSimilarity(disease, PRIORITY_KEYWORDS.low)
        };
        const priority = Object.entries(priorityScores)
            .sort(([, a], [, b]) => b - a)[0][0];
        console.log('Generated priority:', priority);
        return priority;
    }
    catch (error) {
        console.error('Error in getPriority:', error);
        return 'medium'; // Default priority if matching fails
    }
});
exports.getPriority = getPriority;
const generateDescription = (disease) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Generating description for disease:', disease);
        // First check if disease exists in predefined list
        const knownDisease = diseases_1.DISEASES.find(d => d.english.toLowerCase() === disease.toLowerCase());
        if (knownDisease) {
            const description = `Patient reported with ${disease}. Requires immediate medical attention based on condition.`;
            console.log('Generated description for known disease:', description);
            return description;
        }
        // If not found, generate description based on priority
        const priority = yield (0, exports.getPriority)(disease);
        const description = generateContextualDescription(disease, priority);
        console.log('Generated description:', description);
        return description;
    }
    catch (error) {
        console.error('Error in generateDescription:', error);
        return `Patient reported with ${disease}`; // Default description if generation fails
    }
});
exports.generateDescription = generateDescription;
const getMaxSimilarity = (text, keywords) => {
    return Math.max(...keywords.map(keyword => string_similarity_1.default.compareTwoStrings(text.toLowerCase(), keyword.toLowerCase())));
};
const generateContextualDescription = (disease, priority) => {
    const severityMap = {
        critical: 'critical',
        high: 'serious',
        medium: 'moderate',
        low: 'mild'
    };
    const severityText = severityMap[priority] || 'moderate';
    return `Patient reported with ${disease}. Initial assessment indicates ${severityText} condition requiring medical attention.`;
};
