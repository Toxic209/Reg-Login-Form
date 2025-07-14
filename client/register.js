document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const form = document.getElementById("registerForm")
        const formData = new FormData(form);
        
        const response = await fetch("http://localhost:4000/api/v1/users/register", {
            method: "POST",
            credentials: "include",
            body: formData
        })
        // https://httpbin.org/post

        const data = await response.json()

        if (response.ok) {
            alert("Registration Successful!")
            window.location.href = "./login.html"
        } else {
            alert(data.message || "Registration Failed!")
        }
    } catch (error) {
        console.error("User Registration Failed", error.message || error)
        alert("Something Went Wrong")
    }
})