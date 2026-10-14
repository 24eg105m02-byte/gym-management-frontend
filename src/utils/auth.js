export const getCurrentUser = () => {
  const user = localStorage.getItem("fitcoreUser");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const isLoggedIn = () => {
  return (
    localStorage.getItem("fitcoreLoggedIn") === "true" &&
    !!localStorage.getItem("fitcoreToken")
  );
};

export const getToken = () => localStorage.getItem("fitcoreToken");

export const logout = () => {
  localStorage.removeItem("fitcoreUser");
  localStorage.removeItem("fitcoreLoggedIn");
  localStorage.removeItem("fitcoreRememberMe");
  localStorage.removeItem("fitcoreToken");
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const saveAuthSession = (token, user, rememberMe = false) => {
  localStorage.setItem("fitcoreToken", token);
  localStorage.setItem("fitcoreUser", JSON.stringify(user));
  localStorage.setItem("fitcoreLoggedIn", "true");
  if (rememberMe) {
    localStorage.setItem("fitcoreRememberMe", "true");
  } else {
    localStorage.removeItem("fitcoreRememberMe");
  }
};

export const getRoleHome = (role) => {
  if (role === "ADMIN") return "/admin";
  if (role === "TRAINER") return "/trainer";
  if (role === "MEMBER") return "/member";
  return "/login";
};
