exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
      // unique: true,
    },
    username: {
      // For reference, Github limits usernames to 39 characters
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    email: {
      // Why 254 in length? https://stackoverflow.com/a/1199238
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password: {
      // Why 60 in length? https://www.npmjs.com/package/bcrypt#hash-info
      type: "varchar(60)",
      notNull: true,
    },
    created_at: {
      // Why timestamp with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
