import userIndes from './user-index.js';
const { bcrypt, jwt, secretKey, emailService } = userIndes
import User from '../Models/User-Models/User-Sql/Users.js'
import Address from '../Models/User-Models/User-Sql/Address.js';
import sequelize from '../connectDB/db.js';
import Roles from '../Models/User-Models/User-Sql/Role.js';
import { compare } from 'bcrypt';
import fs from 'fs';
import hbs from 'handlebars';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var findOrCreateRoles = async (roleName) => {
    const role = await Roles.findOne({ where: { name: roleName } }) || await Roles.create({ name: roleName });

    return role.id ? role : await role.save();
};

const signUp = async (req, res) => {
    const userData = req.body;

    try {
        const { name, email, phone, password, address, roles } = userData;
        await sequelize.sync();
        
        const checkEmail = await User.findOne({ where: { email: userData.email } });
        if (checkEmail) {
            return handleStatusCode(res, "Email already exists", 409);
        }
        
        const salt = 10;
        const hashedPass = await bcrypt.hash(password, salt);
        await sequelize.sync();
        await User.sync();
        await Address.sync()
        await Roles.sync()
        

        const save1 = async (role1) => {
            const user = await User.create({
                name,
                email,
                password: hashedPass,
                phone,
                roleId: role1

            });

            const createdAddress = await Address.create({
                city: address.city,
                state: address.state,
            });
            await user.setAddress(createdAddress);


            
            

            res.status(201).json({ data: user });
        }
        
        const userRole = await Roles.findOne({ where: { name: "user" } }) || await Roles.create({ name: "user" });
        const adminRole = await Roles.findOne({ where: { name: "admin" } }) || await Roles.create({ name: "admin" });

        if (!userRole.id) {
            await userRole.save();
        }
        if (!adminRole.id) {
            await adminRole.save();
        }
        userData.role == "admin" ? save1(adminRole.id) : save1(userRole.id)


    } catch (error) {
        handleControllerError(res, error, 'Error processing the Sign Up request', 500);
    }
};
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return handleStatusCode(res, "User email not found", 400);
        }

        const checkHashPass = await compare(password, user.password);

        if (!checkHashPass) {
            return handleStatusCode(res, "Wrong password", 400);
        }

        const token = generateToken(user.id, user.email);
        res.status(200).json({ message: 'Logged In Successfully', data: user, token });
    } catch (error) {
        handleControllerError(res, error, 'Error processing the LogIn request', 500);
    }
};
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return handleStatusCode(res, 'No user found with this email id in our database', 400);
        }

        const token = generateToken(user.id, user.email); 
        const resetPasswordLink = `${token}`;
        const templatePath = path.join(__dirname, '../View', 'index.hbs');
        const htmlContent = hbs.compile(fs.readFileSync(templatePath, 'utf8'))({ resetPasswordLink });

        const emailSent = await emailService.sendPasswordResetEmail(user.email, htmlContent);

        return emailSent
            ? res.status(200).json({ message: 'Password reset email sent', token })
            : handleControllerError(res, 'Error sending password reset email', 500);
    } catch (error) {
        handleControllerError(res, error, 'Error processing the forget password request', 500);
    }
};























const resetPassword = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const { newPassword } = req.body;
        const secretKey = 'your-secret-key'; 

        const decodedToken = jwt.verify(token.replace('Bearer ', ''), secretKey);
        const email = decodedToken.email;

        const user = await User.findOne({ where: { email } });
        if (!user) return handleStatusCode(res, 'Email does not exist in the database', 401);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        handleStatusCode(res, 'Password changed successfully', 201);
    } catch (error) {
        handleControllerError(res, error, 'Error processing the reset password request', 500);
    }
};
const updateProfile = async (req, res) => {
    const userData = req.body;
    const loggedInUserId = req.user.userId;

    try {
        const updatedUser = await User.findOne({ where: { id: loggedInUserId } });

        if (!updatedUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        await updatedUser.update(userData);

        res.status(201).json({ message: 'Profile Updated Successfully' });
    } catch (error) {
        handleControllerError(res, error, 'Error processing the update profile request', 500);
    }
};


const generateToken = (userId, userEmail) => jwt.sign({ userId: userId, email: userEmail }, secretKey, { expiresIn: '1h' });

const handleStatusCode = (res, message, status) => res.status(status).json({ message });

const handleControllerError = (res, error, message = 'Internal Server Error', status = 500) => {
    console.error('Error processing the request:', error);
    return res.status(status).json({ error: message });
};



export default {
    signUp,
    logIn,
    forgetPassword,
    resetPassword,
    updateProfile
};
