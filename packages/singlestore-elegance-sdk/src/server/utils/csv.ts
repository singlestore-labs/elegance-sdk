import csvParser from "csv-parser";

export function csvStringToArray(csvString: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const data: string[] = [];
    const stream = csvParser();

    stream.on("data", row => {
      const text = Object.entries(row)
        .map(([key, value]) => `\\${key}: ${value}`)
        .join("");

      data.push(text);
    });

    stream.on("end", () => {
      resolve(data);
    });

    stream.on("error", error => {
      reject(error);
    });

    stream.write(csvString);
    stream.end();
  });
}
