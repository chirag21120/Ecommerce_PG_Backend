const  User  = require('../model/User');

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  // const id = 5;
  try {
    const user = await User.findByPk(id, {
      attributes: ['username', 'email', 'id', 'addresses', 'role'],
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.updateUser = async (req, res) => {
  const { id } = req.user;
  try {
    const [updatedRowCount, [updatedUser]] = await User.update(req.body, {
      returning: true,
      where: { id },
    });
    if (updatedRowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
};