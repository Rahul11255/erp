const db                = require('../../db/db');
const jwt               = require('jsonwebtoken');
const { OAuth2Client }  = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserService {


  static async verifyGoogleToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken:  token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return {
        google_id: payload.sub,
        email:     payload.email,
        name:      payload.name,
        avatar:    payload.picture,
      };
    } catch (err) {
      throw new Error('Invalid Google token');
    }
  }

  static async googleLogin(token, role) {

    try {

      const response = {
        data: {},
        status: false,
      };

      const googleUser = await this.verifyGoogleToken(token);

      const allowedDomain = process.env.ALLOWED_DOMAIN?.trim();
      const userEmailDomain = googleUser.email.split("@")[1]?.trim();


        if (userEmailDomain !== allowedDomain) {
          throw {
            statusCode: 403,
            message: "Only @k95foods.com domain users are allowed to login",
          };
        }
      const existing = await db("users")
        .where("google_id", googleUser.google_id)
        .orWhere("email", googleUser.email)
        .first();

      let user;

      if (existing) {

        // Prevent role switching

        if (existing.role !== role) {

          throw {
            statusCode: 403,
            message: `Your account is already registered as ${existing.role}`,
          };

        }

        // Update only profile info

        const [updated] = await db("users")
          .where({ id: existing.id })
          .update({
            name: googleUser.name,
            avatar: googleUser.avatar,
          })
          .returning("*");

        user = updated;

      } else {

        // New user

        const [inserted] = await db("users")
          .insert({
            google_id: googleUser.google_id,
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.avatar,
            role: role,
          })
          .returning("*");

        user = inserted;
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      response.data = {
        accessToken,
        userInfo: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      };

      response.status = true;

      return response;

    } catch (err) {

      console.log(err);

      throw err;
    }
  }

  static async getMe(id) {
    try {
      const response = { data: {}, status: false };

      const user = await db('users')
        .select('id', 'name', 'email', 'avatar', 'role', 'created_at')
        .where({ id })
        .first();

      if (!user) throw new Error('User not found');

      response.data   = user;
      response.status = true;

      return response;
    } catch (err) {
      throw err;
    }
  }

  static async listUser(query = {}) {
    try {
      const { key, role, id } = query;

      const dbQuery = db('users')
        .select('id', 'email', 'name', 'avatar', 'role', 'created_at')
        .orderBy('created_at', 'desc');

      if (id)   dbQuery.where({ id });
      if (role) dbQuery.where({ role: role.toUpperCase() });
      if (key) {
        dbQuery.where(function () {
          this.whereILike('name',  `%${key}%`)
              .orWhereILike('email', `%${key}%`);
        });
      }

      const response = await paginate(dbQuery, query);

      return response;
    } catch (err) {
      throw err;
    }
  }



}

module.exports = UserService;