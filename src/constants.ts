const constants = {
  INVALID_MASTERKEY: 'Invalid Master Key or corrupt Lockerfile.',
  ALREADY_EXISTS: 'Lockerfile already exists.',
  NO_LOCKERFILE_FOUND:
    'No Lockerfile found. Try `locker --init` to create a Lockerfile.',
  NO_OVEWRITE: (field: string) =>
    `The entry '${field}' already exists.\nDo 'locker --update ${field}' if you want to update the entry.`,
  FIELD_DOES_NOT_EXIST: (field: string) =>
    `The entry '${field}' does not exist.\nDo 'locker --add ${field}' if you want to create the entry.`,
  NO_OVERWRITE_MASTERKEY: `You can't update the Master Key.`
};

export default constants;
