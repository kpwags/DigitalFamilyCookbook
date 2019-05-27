const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createMeat(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to create a meat');
    }

    const meat = ctx.db.mutation.createMeat(
      {
        data: {
          ...args,
        },
      },
      info,
    );

    return meat;
  },

  async login(parent, { email, password }, ctx) {
    const user = await ctx.db.query.user({ where: { email } });

    // check if user exists
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return user;
  },

  logout(parent, args, ctx) {
    ctx.response.clearCookie('token');
    return { message: 'Logged out' };
  },

  async signup(parent, args, ctx, info) {
    // eslint-disable-next-line no-param-reassign
    args.email = args.email.toLowerCase();

    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info,
    );

    // create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return user;
  },
};

module.exports = Mutations;
