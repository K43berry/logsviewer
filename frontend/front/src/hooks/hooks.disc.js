const Disc = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Get username and token from query parameters
    const username = urlParams.get('user');
    const token = urlParams.get('token');

    const userStore = {
        user: username,
        accessToken: token
    }

    localStorage.setItem("user", JSON.stringify(userStore))
    window.location.href = '/';

}

export default Disc;
