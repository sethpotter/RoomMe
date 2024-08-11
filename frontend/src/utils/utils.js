export const isLogin = () => {
    // add functionality to see if logged in
    return sessionStorage.getItem("userID") > 0;
    return true
}