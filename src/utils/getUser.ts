import User from "../models/userModel";

const getUserData = async (email: string) => {
  const user = await User.findOne({ email })
    // .populate({
    //   path: "joinedRooms",
    //   select: { name: 1, slug: 1, createdBy: 1, _id: 0 },
    //   populate: { path: "createdBy", select: "name -_id" },
    // })
    .populate({
      path: "joinedRooms.room",
      select: "name slug createdBy -_id",
      populate: { path: "createdBy", select: "name -_id" },
    });
  user?.joinedRooms.sort((a, b) => {
    if (a.pinned === b.pinned) {
      return 0;
    }
    return a.pinned ? -1 : 1;
  });
  const newUserData: any = JSON.parse(JSON.stringify(user));
  newUserData.joinedRooms = newUserData.joinedRooms.map((room: any) => {
    return {
      name: room.room.name,
      slug: room.room.slug,
      createdBy: room.room.createdBy,
      pinned: room.pinned,
    };
  });
  return newUserData ? newUserData : null;
};

export default getUserData;
