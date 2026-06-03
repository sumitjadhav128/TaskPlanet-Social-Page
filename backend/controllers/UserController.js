const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// signup
exports.signup = async (req,res) => {
    try {
   const { name, email, password } = req.body;
   const exist = await User.findOne({email})
   if(exist) return res.status(400).json( {msg: "User Already Exist"})

    const salt = await  bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const user = await new User({
        name, email, password: hashedpass
    })

    await user.save();

    res.status(200).json({user})
    } catch(err) {
 res.status(500).json({ msg: err.message });
    }
}

// Login
exports.login = async (req, res) => {
  console.log("login hit")
  const { email, password } = req.body;
  try {
    console.log("finding user");
    const user = await User.findOne({ email });
    console.log("user found", user);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
