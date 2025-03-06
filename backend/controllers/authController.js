const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt'); // For comparing hashed passwords

exports.login = async (req, res) => {
  const { accountid, password } = req.body;

  try {
    // Find the user in the DB
    const user = await User.findOne({ accountid });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify the password (assuming passwords are hashed)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Get secret key
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      console.error('JWT_SECRET is missing!');
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Generate JWT
    const token = jwt.sign({ accountid: user.accountid }, secretKey, { expiresIn: '1h' });

    res.json({ jwt: token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
