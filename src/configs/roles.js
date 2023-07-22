const allRoles = {
  USER: [
    "my-booking",
    "request-booking",
    "quit-room",
    "list-building",
    "cancel-booking",
  ],
  ADMIN: [
    "dashboard",
    "get-users",
    "manage-user",
    "manage-building",
    "manage-room",
    "manage-booking",
  ],
  MANAGER: ["manage-building", "manage-room", "manage-booking"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
