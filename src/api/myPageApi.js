import myAxios from "./myAxios";

export const getMyProfile = async () => {
  const response = await myAxios.get("/api/users/me");
  return response.data;
};

export const updateMyProfile = async (profile) => {
  const response = await myAxios.patch("/api/users/me", profile);
  return response.data;
};

export const getMyProperties = async () => {
  const response = await myAxios.get("/api/users/me/properties");
  return response.data;
};

export const getMyReports = async () => {
  const response = await myAxios.get("/api/users/me/reports");
  return response.data;
};

export const withdrawMembership = async (password) => {
  const response = await myAxios.delete("/api/users/me", {
    data: password ? { password } : undefined,
  });
  return response.data;
};
