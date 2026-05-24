export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (err) {
    return null;
  }
};