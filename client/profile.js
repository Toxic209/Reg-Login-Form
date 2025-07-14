

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:4000/api/v1/users/current-user",
            {
                method: "POST",
                credentials: "include"
            }
        )

        const data = await res.json();
        if (res.ok) {
            username = data.data.username;
            document.getElementById("usernameDisplay").textContent = username;
        } else {
            alert("User not Logged In!");
            window.location.href = "./login.html"
        }

    } catch (error) {
        console.error("Failed to Fetch User!", error);
        alert("Somehting Went Wrong!");
    }
});

document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        const res = await fetch("http://localhost:4000/api/v1/users/logout",
            {
                method: "POST",
                credentials: "include"
            }
        )
    
        const data = await res.json();
    
        if (res.ok) {
            window.location.href = "./login.html"
            alert("User Logged Out!")
        } else{
            console.error(data.message || "Error while Logging out!")
            alert("Unable to Logout!")
        }
    } catch (error) {
        console.error("Something Went Wrong", error)
    }
})