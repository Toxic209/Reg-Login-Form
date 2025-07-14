document.getElementById("LoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const res = await fetch("http://localhost:4000/api/v1/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json", "Accept": "application/json"},
            credentials: "include",
            body: JSON.stringify({username, password})
        })

        const data = await res.json()

        if (res.ok) {
            alert("User Logged In!")
            window.location.href = "./profile.html"
            console.log("User Data:", data)
        } else {
            alert(data.message || "Login Failed!")
        }
    } catch (error) {
        console.error("User Login Failed", error)
        alert("Something Went Wrong")
    }
}
)