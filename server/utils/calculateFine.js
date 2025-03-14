// utils/calculateFine.js
const calculateFine = (dueDate, currentDate) => {
  const finePerDay = 1; // Fine rate per day
  const due = new Date(dueDate);
  const current = new Date(currentDate);
  
  
  if (current <= due) {
    console.log("No fine: Book not overdue");
    return 0;
  }
  
  const diffTime = current - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let fine = 0;

  if (diffDays <= 5) {
    fine = 0; // No fine for the first 5 days
  } 
  else if (diffDays <= 15) {
    fine = (diffDays - 5) * 5; // 5 rupees per day for the next 10 days
  } 
  else if (diffDays <= 30) {
    fine = (10 * 5) + ((diffDays - 15) * 10); // 5 rupees per day for the first 10 days and 10 rupees per day for the next 15 days
  } 
  else {
    fine = (10 * 5) + (15 * 10) + ((diffDays - 30) * 15); // for 30+ days, assuming 15 rupees per day after 30 days.
  }

  return fine;
};

module.exports = calculateFine;
