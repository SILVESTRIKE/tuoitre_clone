const userService = require('../services/user_service');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await userService.getById(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const newUser = await userService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            await userService.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
};
module.exports = userController;