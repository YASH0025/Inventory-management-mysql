

import Tokens from 'jsonwebtoken';
import User from '../Models/User-Models/User-Sql/Users.js';
import Roles from '../Models/User-Models/User-Sql/Role.js';
// import Role from '../Models/User-Models/role.model.js';

const { verify } = Tokens
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verify(token, 'your-secret-key');

    const user = await User.findByPk(decodedToken.userId);

    const roleName = await Roles.findOne({ where: { id: user.roleId } });


    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }


    if (roleName.name === "admin") {
      next();
    } else {
      res.status(403).json({
        message: 'Access forbidden - You are not an admin! Only admins can access this route.',
      });
    }
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(401).json({ message: 'Authentication failed. Token invalid or expired.' });
  }
};




export default auth;
