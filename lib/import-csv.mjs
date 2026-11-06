export function parseCsv(text) {
  const records = [];
  let record = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field === "") {
      quoted = true;
    } else if (character === ",") {
      record.push(field);
      field = "";
    } else if (character === "\n") {
      record.push(field.replace(/\r$/, ""));
      if (record.some((value) => value !== "")) records.push(record);
      record = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("El CSV termina dentro de un campo entre comillas.");
  record.push(field.replace(/\r$/, ""));
  if (record.some((value) => value !== "")) records.push(record);
  if (records.length < 2) throw new Error("El CSV no contiene productos.");

  const [rawHeaders, ...rows] = records;
  const headers = rawHeaders.map((header, index) => index === 0 ? header.replace(/^\uFEFF/, "") : header);
  return rows.map((values, rowIndex) => {
    if (values.length !== headers.length) throw new Error(`La fila ${rowIndex + 2} tiene ${values.length} columnas; se esperaban ${headers.length}.`);
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
}

export function normalizedProductKey(name, category) {
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("es").replace(/\s+/g, " ");
  return `${normalize(name)}|${normalize(category)}`;
}
