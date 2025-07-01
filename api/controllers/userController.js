import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
	// image => cloudinary -> image.cloudinary.your => mongodb

	try {
		const { image, ...otherData } = req.body;

		let updatedData = otherData;
if (image) {
	if (image.startsWith("data:image")) {
		try {
			const uploadResponse = await cloudinary.uploader.upload(image);
			updatedData.image = uploadResponse.secure_url;
		} catch (uploadError) {
			console.error("Error uploading image:", uploadError);
			return res.status(400).json({ success: false, message: "Error uploading image" });
		}
	} else {
		// If it's already a Cloudinary URL, accept it directly
		updatedData.image = image;
	}
}


		const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

		res.status(200).json({
			success: true,
			user: updatedUser,
		});
	} catch (error) {
		console.log("Error in updateProfile: ", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
export const muteUser = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const targetUserId = req.params.id;

    await User.findByIdAndUpdate(currentUser, {
      $addToSet: { mutedUsers: targetUserId },
    });

    res.status(200).json({ success: true, message: "User muted" });
  } catch (error) {
    console.error("Error muting user:", error);
    res.status(500).json({ success: false, message: "Failed to mute user" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const targetUserId = req.params.id;

    await User.findByIdAndUpdate(currentUser, {
      $addToSet: { blockedUsers: targetUserId },
    });

    res.status(200).json({ success: true, message: "User blocked" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ success: false, message: "Failed to block user" });
  }
};
