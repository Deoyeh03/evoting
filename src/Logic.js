export const isEligibleToSignUp = (matricNumber) => {
    const yearPrefix = matricNumber.slice(0, 2); // Get the first two digits of the matric number
    const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
    const admissionYear = parseInt(yearPrefix);
  
    // Check if the matric number starts with a valid year
    if (admissionYear < 20 || admissionYear > currentYear) {
      return false;
    }
  
    // Calculate level based on the current year
    const level = currentYear - admissionYear + 1; // Assuming 100L is for the first year
  
    // If the level is greater than 4 (i.e., 500L), the user has graduated
    return level <= 4;
  };
  
  export const signUp = async (formData) => {
    const response = await fetch('/backend/auth/signup.php', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    const result = await response.json();
    return result;
  };
  