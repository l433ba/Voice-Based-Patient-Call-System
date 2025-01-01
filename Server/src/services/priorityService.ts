import stringSimilarity from 'string-similarity';
import { DISEASES } from '../constants/diseases';

// Common symptoms/keywords for different priority levels
const PRIORITY_KEYWORDS = {
  critical: ['heart attack', 'stroke', 'severe bleeding', 'unconscious', 'not breathing', 'chest pain'],
  high: ['fracture', 'severe pain', 'high fever', 'difficulty breathing', 'head injury'],
  medium: ['moderate pain', 'fever', 'vomiting', 'diarrhea', 'minor cuts'],
  low: ['common cold', 'minor pain', 'rash', 'cough', 'sore throat']
};

export const getPriority = async (disease: string): Promise<string> => {
  try {
    console.log('Getting priority for disease:', disease);
    
    // First check if disease exists in predefined list
    const knownDisease = DISEASES.find(d => 
      d.english.toLowerCase() === disease.toLowerCase()
    );
    
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
      .sort(([,a], [,b]) => b - a)[0][0];
    
    console.log('Generated priority:', priority);
    return priority;
  } catch (error) {
    console.error('Error in getPriority:', error);
    return 'medium'; // Default priority if matching fails
  }
};

export const generateDescription = async (disease: string): Promise<string> => {
  try {
    console.log('Generating description for disease:', disease);
    
    // First check if disease exists in predefined list
    const knownDisease = DISEASES.find(d => 
      d.english.toLowerCase() === disease.toLowerCase()
    );
    
    if (knownDisease) {
      const description = `Patient reported with ${disease}. Requires immediate medical attention based on condition.`;
      console.log('Generated description for known disease:', description);
      return description;
    }

    // If not found, generate description based on priority
    const priority = await getPriority(disease);
    const description = generateContextualDescription(disease, priority);
    
    console.log('Generated description:', description);
    return description;
  } catch (error) {
    console.error('Error in generateDescription:', error);
    return `Patient reported with ${disease}`; // Default description if generation fails
  }
};

const getMaxSimilarity = (text: string, keywords: string[]): number => {
  return Math.max(...keywords.map(keyword => 
    stringSimilarity.compareTwoStrings(text.toLowerCase(), keyword.toLowerCase())
  ));
};

const generateContextualDescription = (disease: string, priority: string): string => {
  const severityMap = {
    critical: 'critical',
    high: 'serious',
    medium: 'moderate',
    low: 'mild'
  };
  
  const severityText = severityMap[priority as keyof typeof severityMap] || 'moderate';
  return `Patient reported with ${disease}. Initial assessment indicates ${severityText} condition requiring medical attention.`;
}; 