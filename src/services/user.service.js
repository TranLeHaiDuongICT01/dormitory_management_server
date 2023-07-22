const httpStatus = require("http-status");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

class UserService {
  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  static createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    if (userBody.code && await User.isCodeTaken(userBody.code)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Code already taken");
    }
    return User.create(userBody);
  };
  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<User>}
   */
  static getUserByEmail = async (email) => {
    return User.findOne({ email });
  };
  /**
   * Get user by id
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */
  static getUserById = async (id) => {
    return User.findById(id);
  };
  /**
   * Update user by id
   * @param {ObjectId} userId
   * @param {Object} updateBody
   * @returns {Promise<User>}
   */
  static updateUserById = async (userId, updateBody) => {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (
      updateBody.email &&
      (await User.isEmailTaken(updateBody.email, userId))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    if (
      updateBody.code &&
      (await User.isCodeTaken(updateBody.code, userId))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Code already taken");
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  };
  /**
   * Query for users
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  static queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
  };
  /**
   * Delete user by id
   * @param {ObjectId} userId
   * @returns {Promise<User>}
   */
  static deleteUserById = async (userId) => {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await user.deleteOne();
    return user;
  };
}

module.exports = UserService;
