const UserRoles = require('../enum/UserRole');

const getUserRole = (user) => {
  let role = '';
  const { roles } = user;

  if (roles.includes(UserRoles['ADMIN'])) {
    role = UserRoles['ADMIN'];
  } else if (roles.includes(UserRoles['EXECUTIVE'])) {
    role = UserRoles['EXECUTIVE'];
  } else if (roles.includes(UserRoles['MANAGER'])) {
    role = UserRoles['MANAGER'];
  } else {
    role = UserRoles['SALESPERSON'];
  }

  return role;
};

module.exports = { getUserRole };
