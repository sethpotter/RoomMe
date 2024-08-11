
const pool = require('./db')
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFile, getFileStream, deleteFile } = require('./s3')

module.exports = function routes(app, logger) {
  // 
  app.post('/profilePicture', upload.single('image'), async (req, res) => {
    const userID = req.query.userID;
    const oldFileID = req.query.oldFileID
    const file = req.file;
    await uploadFile(file)
    await deleteFile(oldFileID)
    unlinkFile(file.path)

    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query('Update Users set profilePic = (?) where userID = (?)', [file.filename, userID], function (err, rows, fields) {
          if (err) {
            // if there is an error with the query, release the connection instance and log the error
            connection.release()
            logger.error("Problem dropping the table test_table: ", err);
            res.status(400).send('Problem adding profile picture');
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
  });

  app.get('/profilePic/:key', (req, res) => {
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
  })

  app.get('/profile', (req, res) => {
    const userID = req.query.userID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query('select firstName,lastName,bio,profilePic,joinDate,gender from Users where userID = (?)', [userID], function (err, rows, fields) {
          connection.release()
          if (err) {
            // if there is an error with the query, release the connection instance and log the error
            logger.error("Problem dropping the table test_table: ", err);
            res.status(400).send('Problem dropping the table');
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
  });

  app.put('/profile', (req, res) => {
    const userID = req.query.userID;
    const bio = req.query.bio;
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query('UPDATE Users set bio = (?), firstName = (?), lastName = (?) where userID = (?)', [bio,firstName,lastName,userID], function (err, rows, fields) {
          connection.release()
          if (err) {
            // if there is an error with the query, release the connection instance and log the error
            logger.error("Problem dropping the table test_table: ", err);
            res.status(400).send('Problem dropping the table');
          } else {
            res.status(200).send('Profile updated succesfully');
          }
        });
      }
    });
  });

  // Post a user
  // users?username={userName}&password={password}&firstName={firstName}&lastName={lastName}&phoneNumber={phoneNumber}&email={email}&private={private}
  app.post('/register', (req, res) => {
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var email = req.query.email;
    var password = req.query.password;
    var gender = req.query.gender;
    let joinDate = new Date();

    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          // if there is no issue obtaining a connection, execute query and release connection
          connection.query('INSERT INTO Users(firstName, lastName, email, password, private, joinDate, gender) VALUES(?,?,?,?,?,?,?) ', [firstName, lastName, email, hash, 0, joinDate, gender], function (err, rows, fields) {
            if (err) {
              connection.release();
              if (err.message.includes("Duplicate entry")) {
                // logger.error("Email already used: \n", err.message);
                res.status(200).send('Email already used');
              }
              else {
                // if there is an error with the query, log the error
                // logger.error("Problem creating account: \n", err.message);
                res.status(400).send('Problem creating account');
              }
            } else {
              connection.query(`INSERT INTO Preferences(userID)
                VALUES((select userID from Users where email = (?) && password=(?)))`, [email, hash], function (err, rows, fields) {
                connection.release();
                if (err) {
                  // if there is an error with the query, log the error
                  res.status(400).send('Problem creating preferences for account');
                } else {
                  // execute code to test for access and login
                  console.log("Succesfully added user to preferences table")
                  res.status(200).send('Registered account succesfully');
                }
              });
            }
          });
        });
      }
    });
  });

  // /login
  app.get('/login', (req, res) => {
    var email = req.query.email;
    var password = req.query.password;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('select userID,password from Users where email = (?)', [email], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            // logger.error("Problem getting from table: \n", err);
            res.status(400).send(`Email doesn't exist`);
          } else {
            rows[0] ?
              bcrypt.compare(password, rows[0].password, function (err, result) {
                // execute code to test for access and login
                if (result) {
                  res.status(200).json({
                    "data": rows[0].userID
                  });
                }
                else {
                  // logger.error("Incorrect password \n");
                  res.status(400).send('Incorrect password');
                }
              }) : res.status(400).send(`Email doesn't exist`);
          }
        });
      }
    });
  });

  app.get('/preferences', (req, res) => {
    var userID = req.query.userID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('select * from Preferences where userID = (?)', [userID], function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            // logger.error("Problem getting from table: \n", err);
            res.status(400).send('Problem getting table');
          } else {
            // console.log(rows[0])
            res.status(200).json({
              "data": rows[0]
            });
          }
        });
      }
    });
  });

  app.put('/preferences', (req, res) => {
    var smoking = req.query.smoking;
    var drinking = req.query.drinking;
    var clean = req.query.clean;
    var bedEarly = req.query.bedEarly;
    var morningPerson = req.query.morningPerson;
    var visitors = req.query.visitors;
    var goOut = req.query.goOut;
    var userID = req.query.userID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(`UPDATE Preferences SET smoking = (?), drinking = (?), clean = (?), bedEarly = (?), morningPerson = (?),
          visitors = (?), goOut = (?) WHERE userID = (?)`,
          [smoking, drinking, clean, bedEarly, morningPerson, visitors, goOut, userID], function (err, rows, fields) {
            if (err) {
              // if there is an error with the query, log the error
              // logger.error("Problem getting from table: \n", err);
              res.status(400).send('Problem getting table');
            } else {
              console.log('Preferences updated');

              // Delete all potential matches that aren't matched yet
              connection.query(`DELETE from Potential where userID = (?) || matchUserID = (?) && liked IS null`,
                [userID, userID], function (err, rows, fields) {
                  if (err) {
                    // if there is an error with the query, log the error
                    // logger.error("Problem getting from table: \n", err);
                    res.status(400).send('Problem getting table');
                  } else {
                    console.log('Deleted unmatched potentials');

                    connection.query(`SELECT * FROM Preferences where userID = (?) UNION
                SELECT Preferences.userID, smoking,drinking,clean,bedEarly,morningPerson,visitors,goOut 
                from Preferences INNER JOIN Users where Users.userID = Preferences.userID &&
                gender = (select gender from Users where userID = (?)) && Preferences.userID != (?)
                && Preferences.userID NOT IN (select matchUserID from Potential where userID = (?))`,
                      [userID, userID, userID, userID], function (err, rows, fields) {
                        if (err) {
                          // if there is an error with the query, log the error
                          // logger.error("Problem getting from table: \n", err);
                          res.status(400).send('Problem getting table');
                        } else {
                          console.log('Got preferences of all potential matches');
                          for (var i = 1; i < rows.length; i++) {
                            const count = (!!(rows[i].smoking == rows[0].smoking) +
                              !!(rows[i].drinking == rows[0].drinking) +
                              !!(rows[i].clean == rows[0].clean) +
                              !!(rows[i].bedEarly == rows[0].bedEarly) +
                              !!(rows[i].morningPerson == rows[0].morningPerson) +
                              !!(rows[i].visitors == rows[0].visitors) +
                              !!(rows[i].goOut == rows[0].goOut))
                            //Do something
                            connection.query(`INSERT INTO Potential(userID,matchUserID,questionRating)
                      VALUES ((?), (?), (?)), ((?),(?),(?))`,
                              [rows[0].userID, rows[i].userID, count, rows[i].userID, rows[0].userID, count],
                              function (err, rows, fields) {
                                if (err) {
                                  // if there is an error with the query, log the error
                                  // logger.error("Problem getting from table: \n", err);
                                  res.status(400).send('Problem getting table');
                                }
                              });
                          }
                          connection.release();
                          console.log(`Potential matches added for new preferences`)
                          res.status(200).send('Preferences set succesfully');
                        }
                      });
                  }
                });
            }
          });
      }
    });
  });

  app.get('/potential', (req, res) => {
    const userID = req.query.userID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query(`select Users.userID,firstName,lastName,bio,profilePic,gender,joinDate,smoking, drinking,clean,bedEarly,morningPerson,visitors,goOut  
                        from Users INNER JOIN Preferences where Users.userID = (
                          select matchUserID from Potential where userID = (?) && liked IS null
                            && matchUserID IN (select userID from Users where userID != (?) && private = 0
                              && gender = (select gender from Users where userID = (?)))
                            ORDER BY questionRating DESC LIMIT 1)
                                && Users.userID = Preferences.userID;`,
          [userID, userID, userID], function (err, rows, fields) {
            connection.release()
            if (err) {
              // if there is an error with the query, release the connection instance and log the error
              logger.error("Problem getting next potential roomate", err);
              res.status(400).send('Problem getting next potential roomate');
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });
      }
    });
  });

  //get all matches history (including send and receive), prob use in chatbox
  app.get('/messages', (req, res) => {
    const userID = req.query.userID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query(`select Messaging.messageContent,messageTimeSent from Messaging 
            where (userID or matchUserID = (?)) ORDER BY messageTimeSent;`,
          [userID], function (err, rows, fields) {
            connection.release()
            if (err) {
              // if there is an error with the query, release the connection instance and log the error
              logger.error("Problem getting available messages", err);
              res.status(400).send('Problem getting available messages');
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });
      }
    });
  });

  //get all people (with their id,name,profile) you match with (all people you can message), prob use in chatlist
  app.get('/matches', (req, res) => {
    const userID = req.query.userID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query(`select Users.userID,firstName,lastName,profilePic
        from Users INNER JOIN Matches 
        where Users.userID = Matches.matchUserID  && Matches.userID = (?);`,
          [userID], function (err, rows, fields) {
            connection.release()
            if (err) {
              // if there is an error with the query, release the connection instance and log the error
              logger.error("Problem getting available messages", err);
              res.status(400).send('Problem getting available messages');
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });
      }
    });
  });
  //get top 5 message content/time of the latest message from each match users 
  //(maybe you need this but from figma looks like you only need the recent senders which I route next)
  app.get('/recent_messages', (req, res) => {
    const userID = req.query.userID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query(`SELECT Messaging.messageContent,messageTimeSent 
        FROM Messaging 
        WHERE messageID IN (
            SELECT MAX(messageID)
            FROM Messaging
            WHERE matchUserID = (?)
            GROUP BY userID )
        ORDER BY messageTimeSent DESC
        LIMIT 5
        ;`,
          [userID], function (err, rows, fields) {
            connection.release()
            if (err) {
              // if there is an error with the query, release the connection instance and log the error
              logger.error("Problem getting available messages", err);
              res.status(400).send('Problem getting available messages');
            } else {
              res.status(200).json({
                "data": rows
              });
            }
          });
      }
    });
  });

//get 5 latest users that send you a message
app.get('/recent_users', (req, res) => {
  const userID = req.query.userID;
  // obtain a connection from our pool of connections
  pool.getConnection(function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err)
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      connection.query(`SELECT Users.userID,firstName,lastName,profilePic
      from Users INNER JOIN
      (SELECT Messaging.userID 
              FROM Messaging 
              WHERE messageID IN (
                  SELECT MAX(messageID)
                  FROM Messaging
                  WHERE matchUserID = (?)
                  GROUP BY userID )
              ORDER BY messageTimeSent DESC
              LIMIT 5
      ) s
      on s.userID = Users.userID;`,
        [userID], function (err, rows, fields) {
          connection.release()
          if (err) {
            // if there is an error with the query, release the connection instance and log the error
            logger.error("Problem getting available messages", err);
            res.status(400).send('Problem getting available messages');
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
    }
  });
});



  // Post a message
  // userID is sender and matchUserID is receiver 
  app.post('/message', (req, res) => {
    var content = req.query.content;
    var userID = req.query.userID;
    var matchUserID = req.query.matchUserID;
    let messageDate = new Date();

    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        connection.query('INSERT INTO Messaging(messageContent, userID, matchUserID, messageTimeSent) VALUES(?,?,?,?)', [content, userID, matchUserID, messageDate], function (err, rows, fields) {
          if (err) {
            connection.release();
            // if there is an error with the query, log the error
            // logger.error("Problem creating account: \n", err.message);
            res.status(400).send('Problem creating account');
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
  });


  app.put('/dislike', (req, res) => {
    const userID = req.query.userID;
    const potentialID = req.query.potentialID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if (err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        connection.query('UPDATE Potential set liked = (?) where (userID = (?) && matchUserID = (?)) || (userID = (?) && matchUserID = (?))', 
          [false,userID,potentialID,potentialID,userID], function (err, rows, fields) {
          connection.release()
          if (err) { 
            // if there is an error with the query, release the connection instance and log the error
            logger.error("Problem dropping the table test_table: ", err); 
            res.status(400).send('Problem dropping the table'); 
          } else {
            res.status(200).send('Profile updated succesfully'); 
          }
        }); 
      }
    });
  });

  app.put('/like', (req, res) => {
    const userID = req.query.userID;
    const potentialID = req.query.potentialID;
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if (err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        connection.query('UPDATE Potential set liked = (?) where userID = (?) && matchUserID = (?)', 
          [true,userID,potentialID], function (err, rows, fields) {
          if (err) { 
            // if there is an error with the query, release the connection instance and log the error
            logger.error("Problem liking other user", err); 
            res.status(400).send('Problem liking other user'); 
          } else {
            connection.query('select liked from Potential where userID = (?) && matchUserID = (?)', 
              [potentialID,userID], function (err, rows, fields) {
              if (err) { 
                // if there is an error with the query, release the connection instance and log the error
                logger.error("Problem seeing if other user liked back", err); 
                res.status(400).send('Problem seeing if other user liked back'); 
              } else {
                console.log(rows[0])
                if(rows[0].liked === 1){
                  connection.query(`INSERT INTO Matches(userID, matchUserID) VALUES((?),(?)), ((?),(?))`, 
                    [userID,potentialID,potentialID,userID], function (err, rows, fields) {
                    connection.release()
                    if (err) { 
                      // if there is an error with the query, release the connection instance and log the error
                      logger.error("Problem creating match ", err); 
                      res.status(400).send('Problem creating match'); 
                    } else {
                      res.status(200).send('Like profile and matched!'); 
                    }
                  });
                }
                else{
                  res.status(200).send('Liked profile and waiting for other person.'); 
                }
              }
            }); 
          }
        }); 
      }
    });
  });
}
