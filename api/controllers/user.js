'use strict';

const { ObjectId } = require('mongodb');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../helpers/auth');
const smtpService = require('../helpers/smtp.service');
const UserRoles = require('../enum/UserRole');
const { getUserRole } = require('../utils/utils');

const saltRounds = process.env.SALT_ROUNDS;

const signup = (req, res) => {
  const data = req.swagger.params.body.value;

  User.where({
    email: { $regex: data.email, $options: 'i' },
  })
    .findOne()
    .then((user) => {
      if (user) {
        res.status(409);
        res.json({ message: 'Email already registered!' });
        return;
      }
      const newUser = new User({
        ...data,
        password: bcrypt.hashSync(data.password, Number(saltRounds)),
        date_created: new Date(),
      });

      newUser
        .save()
        .then((savedUser) => res.json(savedUser))
        .catch((e) => {
          res.json(e);
        });
    });
};

const signin = (req, res) => {
  const data = req.swagger.params.body.value;
  const { email, password } = data;

  User.where({
    email: { $regex: email, $options: 'i' },
  })
    .findOne()
    .then((user) => {
      if (user) {
        if (user.is_deleted) {
          res.status(401);
          res.json({ message: 'You are deactivated!' });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          const token = auth.issueToken(user.email);
          res.json({
            token,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            roles: user.roles,
          });
        } else {
          res.status(401);
          res.json({ message: 'Password mismatch!' });
        }
        return;
      }
      res.status(401);
      res.json({ message: 'No User exists!' });
    });
};

const getUser = (req, res) => {
  const email = req.swagger.params.email.value;
  User.findOne({
    email: { $regex: email, $options: 'i' },
  }).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      res.json({ message: 'No exist!' });
    }
  });
};

const updateUser = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    const data = req.swagger.params.body.value;
    const { email } = data;

    User.findOne({
      _id: { $ne: ObjectId(id) },
      email: { $regex: email, $options: 'i' },
    }).then((user) => {
      if (user) {
        res.status(409);
        res.json({ message: 'Email already exists!' });
        return;
      } else {
        User.findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: data },
          { returnOriginal: false },
          (err, user) => {
            if (err) {
              res.status(400);
              res.json({ message: 'Error!' });
            } else if (user) {
              res.json(user);
            } else {
              res.status(404);
              res.json({ message: 'No exist!' });
            }
          }
        );
      }
    });
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const deleteUser = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    User.deleteOne({ _id: ObjectId(id) }).then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404);
        res.json({ message: 'No exist!' });
      }
    });
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const listUsers = async (req, res) => {
  const { email } = req.auth;

  User.where({
    email: { $regex: email, $options: 'i' },
  })
    .findOne()
    .then((user) => {
      if (!user) {
        res.status(409);
        res.json({ message: 'You are not a user!' });
        return;
      }

      let where = {};
      const userRole = getUserRole(user);
      if (userRole === UserRoles['MANAGER']) {
        where = {
          _id: { $ne: user._id },
          'roles.1': { $exists: false },
          'roles.0': UserRoles['SALESPERSON'],
        };
      } else if (userRole === UserRoles['EXECUTIVE']) {
        where = {
          _id: { $ne: user._id },
          roles: {
            $nin: [UserRoles['ADMIN']],
          },
        };
      }

      if (userRole === UserRoles['SALESPERSON']) {
        return new Promise((resolve) => resolve({}));
      }

      return User.where(where).find();
    })
    .then((users) => res.json(users));
};

const activate = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    User.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          is_deleted: false,
        },
      },
      { returnOriginal: false },
      (err, user) => {
        if (err) {
          res.status(400);
          res.json({ message: 'Error!' });
        } else if (user) {
          res.json(user);
        } else {
          res.status(404);
          res.json({ message: 'No exist!' });
        }
      }
    );
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const deactivate = (req, res) => {
  const id = req.swagger.params.id.value;

  if (ObjectId.isValid(id)) {
    User.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          is_deleted: true,
        },
      },
      { returnOriginal: false },
      (err, user) => {
        if (err) {
          res.status(400);
          res.json({ message: 'Error!' });
        } else if (user) {
          res.json(user);
        } else {
          res.status(404);
          res.json({ message: 'No exist!' });
        }
      }
    );
  } else {
    res.status(409);
    res.json({ message: 'Invalid id!' });
  }
};

const inviteUser = (req, res) => {
  const data = req.swagger.params.body.value;

  User.where({
    email: { $regex: data.email, $options: 'i' },
  })
    .findOne()
    .then((user) => {
      if (user) {
        res.status(409);
        res.json({ message: 'Email already registered!' });
        return;
      }
      const newUser = new User({
        ...data,
        password: bcrypt.hashSync(data.password, Number(saltRounds)),
        date_created: new Date(),
      });

      newUser
        .save()
        .then((savedUser) => {
          // send email to the invited user.
          let mailOptions = {
            from: process.env.SMTP_FROM_EMAIL,
            to: data.email,
            subject: `You're invited to luther.`,
            html: `
              Somebody invited you to the luther.
              <br />
              You can use the following credentials to login to luther,
              and later, you can update your password.
              <br />
              Email: ${data.email}
              <br />
              Password: ${data.password}
              <br />
              <a href="${process.env.LUTHER_URL}" target="_blank">Log in</a>
              <br />
              If you did not request a new password, please let us know immediately.
              <br/>
            `,
          };

          return smtpService().sendMail(mailOptions);
        })
        .then((success) => {
          // return success.
          res.json({ success });
        })
        .catch((e) => {
          res.json(e);
        });
    });
};

module.exports = {
  signup,
  signin,
  getUser,
  updateUser,
  deleteUser,
  listUsers,
  activate,
  deactivate,
  inviteUser,
};
