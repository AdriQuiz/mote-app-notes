interface UserInfo {
    name: string,
    id: string,
    age: number
}


const getAndSetUserInfo = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get("/get-user");
        console.log("Response: ", response);

        if (response.data && response.data.user) {
            setUserInfo(response.data.user);
        }

    } catch (error) {
        if (error.response.status === 401) {
            localStorage.clear();
            navigate("/login");
        }
    }
}

function getAndSetUserInfos(): Promise<void> {

}