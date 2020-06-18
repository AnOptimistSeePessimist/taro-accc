// 格式化时间戳为日期
export const formatTimeStampToTime = (timestamp) => {
  const date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const year = date.getFullYear();
  const month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  // const hour = date.getHours() + ':';
  // const minutes = date.getMinutes() + ':';
  // const second = date.getSeconds();
  return `${year}-${month}-${day}`
}
