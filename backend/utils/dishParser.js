// Utility to parse dish input and extract food items with quantities

function parseDishInput(input) {
  // Convert to lowercase for easier processing
  const lowerInput = input.toLowerCase();
  
  // Regular expressions to match quantities and units
  const quantityRegex = /\b(\d+(?:\.\d+)?)\s*(whole|half|quarter|1\/2|1\/4|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/g;
  const unitRegex = /\b(cup|cups|tablespoon|tbsp|teaspoon|tsp|oz|ounce|ounces|lb|pound|pounds|gram|grams|g|kg|kilogram|kilograms|piece|pieces|slice|slices|item|items|pinch|dash|handful|small|medium|large)\b/g;
  
  // Split the input into words/phrases
  const words = input.split(/[,+]|and|with|plus|\s(?=\d)/gi);
  
  const items = [];
  
  for (let word of words) {
    word = word.trim();
    if (!word) continue;
    
    // Extract quantity
    let quantity = 1; // default quantity
    let unit = 'piece'; // default unit
    
    // Look for quantity patterns
    const quantityMatch = word.match(/(\d+(?:\.\d+)?)\s*(cup|cups|tablespoon|tbsp|teaspoon|tsp|oz|ounce|ounces|lb|pound|pounds|gram|grams|g|kg|kilogram|kilograms|piece|pieces|slice|slices|item|items|pinch|dash|handful|small|medium|large)?/i);
    
    if (quantityMatch) {
      quantity = parseFloat(quantityMatch[1]);
      if (quantityMatch[2]) {
        unit = quantityMatch[2].toLowerCase();
      }
    } else {
      // Check for word-based numbers
      const wordNumberMap = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'half': 0.5, 'quarter': 0.25
      };
      
      for (const [wordNum, numVal] of Object.entries(wordNumberMap)) {
        if (word.toLowerCase().includes(wordNum)) {
          quantity = numVal;
          break;
        }
      }
    }
    
    // Extract the food name by removing quantity and unit words
    let foodName = word.replace(/(\d+(?:\.\d+)?)\s*/g, '');
    foodName = foodName.replace(/\b(cup|cups|tablespoon|tbsp|teaspoon|tsp|oz|ounce|ounces|lb|pound|pounds|gram|grams|g|kg|kilogram|kilograms|piece|pieces|slice|slices|item|items|pinch|dash|handful|small|medium|large)\b/gi, '');
    foodName = foodName.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|half|quarter)\b/gi, '');
    foodName = foodName.replace(/[^\w\s]/g, '').trim();
    
    if (foodName) {
      items.push({
        name: foodName,
        quantity: quantity,
        unit: unit
      });
    }
  }
  
  // If no items were extracted, treat the whole input as one item
  if (items.length === 0) {
    items.push({
      name: input,
      quantity: 1,
      unit: 'portion'
    });
  }
  
  return items;
}

module.exports = {
  parseDishInput
};