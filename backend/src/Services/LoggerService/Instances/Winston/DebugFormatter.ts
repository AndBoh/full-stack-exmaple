import { format } from 'winston';

const debugFormatter = format((data) => {
  const { message, timestamp, label } = data;

  const result = { ...data };
  result.message = `${timestamp} - ${label}: ${message}`;
  delete result.timestamp;
  delete result.label;

  return result;
});

export { debugFormatter };
