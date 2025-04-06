import userModels from "../models/userModels"

export const getProfile = async (req, res) => {
    try {
      const user = await userModels.findById(req.user.id).select("-password");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile", error });
    }
  };
  