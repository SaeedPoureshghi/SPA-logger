const sqlite3 = require("sqlite3");

const DB_PATH = "./logs.db";

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("DB Connected successfully.");

    db.exec(
      `
                CREATE TABLE IF NOT EXISTS tbl_logs(
                    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
                    log_description     text,
                    log_starttime       datetime,
                    log_endtime         datetime,
                    log_createat        datetime default current_timestamp
                )
            `,
      (err) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("Table `tbl_logs` created successfully.");
        }
      }
    );
  }
});

const logsList = async (callback) => {
  await db.all("SELECT * from tbl_logs", (err, rows) => {
    if (err) {
      callback(err.message, null);
    } else {
      callback(null, rows);
    }
  });
};

const logsInsert = async (description, starttime, endtime, callback) => {
  let stmt = await db.prepare(
    "INSERT INTO tbl_logs (log_description,log_starttime,log_endtime) VALUES (@log_description,@log_starttime,@log_endtime)"
  );
  await stmt.run(
    {
      "@log_description": description,
      "@log_starttime": starttime,
      "@log_endtime": endtime,
    },
    (err, result) => {
      if (err) {
        callback(err.message, null);
      } else {
        callback(null, "Log inserted successfully.");
      }
    }
  );
};

const logsDelete = async (id, callback) => {
  let stmt = await db.prepare("DELETE FROM tbl_logs where id=@id");
  await stmt.run(
    {
      "@id": id,
    },
    (err, result) => {
      if (err) {
        callback(err.message, null);
      } else {
        callback(null, `Log #${id} Removed successfully.`);
      }
    }
  );
};

module.exports = { db, logsList, logsInsert, logsDelete };
