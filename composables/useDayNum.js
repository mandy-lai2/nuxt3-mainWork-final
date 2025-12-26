export const useDayNum = () => {
  const countDay = (startDate, endDate) => {
    if (!startDate || !endDate) return;
    const end = new Date(endDate);
    const start = new Date(startDate);
    //new Date('2025-06-27') -> end = Fri Jun 27 2025 00:00:00 GMT+0800 (台北標準時間)Date 物件
    //Date 物件相減時，會自動轉為毫秒數相減。
    return parseInt(Math.abs(end - start) / 1000 / 60 / 60 / 24);
  };

  return {
    countDay,
  };
};
