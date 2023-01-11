import * as fs from 'fs';

export const beginOfDate = (date: Date | null = null) => {
  if (date === null) {
    date = new Date();
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

export const endOfDate = (date: Date | null = null) => {
  if (date === null) {
    date = new Date();
  }
  date.setHours(23, 59, 59, 999);
  return date;
};

export const upload = async (
  buffer: any,
  filename: string,
  path: string,
  url: string,
): Promise<boolean> => {
  return await new Promise(async (resolve, reject) => {
    try {
      await fs.promises.mkdir(path, { recursive: true });
      const writeSteam = fs.createWriteStream(url);
      writeSteam.write(buffer);
      writeSteam.end().on('finish', () => {
        resolve(true);
      });
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};
export const getFileExtension = (filename: string): string => {
  return '.' + filename.split('.').pop();
};
