const { getCategory } = require('../data/db.js');

module.exports = {
  async findCategory(req, res) {
    const user = await getCategory();

    try {
      return res.status(200).json(user.rows);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },
};
