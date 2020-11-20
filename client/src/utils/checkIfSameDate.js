const checkIfSameDate = date => {
  const now = new Date();
  const orderDate = new Date(date);

  return (
    now.getFullYear() === orderDate.getFullYear() &&
    now.getMonth() === orderDate.getMonth() &&
    now.getDate() === orderDate.getDate()
  );
};

export default checkIfSameDate;
