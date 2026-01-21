export function login(token: string) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
}

export function isLoggedIn() {
    return !!localStorage.getItem("token");
}
