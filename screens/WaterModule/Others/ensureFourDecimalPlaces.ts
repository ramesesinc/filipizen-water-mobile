function ensureFourDecimalPlaces(number) {
    // Convert the number to a string
    let numberString = number.toString();
    
    // Check if the number has a decimal point
    if (!numberString.includes('.')) {
      // If it's a whole number, append '.0000'
      numberString += '.0000';
    } else {
      // If it has a decimal point, ensure it has exactly four decimal places
      const parts = numberString.split('.');
      while (parts[1].length < 4) {
        parts[1] += '0';
      }
      numberString = parts.join('.');
    }
  
    return numberString;
  }

  export default ensureFourDecimalPlaces