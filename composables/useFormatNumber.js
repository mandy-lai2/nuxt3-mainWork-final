export const useFormatNumber = () => {
  /**
   * toLocaleString 將其格式化為包含千分符號的字串
   * 無法格式化時，以原字串回傳
   * 例如 120,000
   */
  const formatNumber = (value) => {
    const numberValue = parseInt(value);
    if (isNaN(numberValue)) return value;
    return numberValue.toLocaleString();
  };

  return {
    formatNumber
  };
};