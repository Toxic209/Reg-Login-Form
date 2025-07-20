document.getElementById("UpdateForm").addEventListener("submit", async(e) => {
    e.preventDefault();

    try {
        const username = document.getElementById("username").value
        const email = document.getElementById("email").value

        console.log("fetching...")
        
        const response = await fetch("http://localhost:4000/api/v1/users/update-user", {
            method: "POST",
            credentials: "include",
            headers: {
            "Content-Type": "application/json"
        },
            body: JSON.stringify({username, email})
        })

        const data = await response.json()

        if (response.ok) {
            alert("User Updated!")
            window.location.href = "./profile.html"
        } else {
            alert(data.message || "User Update Failed!")
        } 

    } catch (error) {
        console.log("Details Updation Failed!", error || error.message)
        alert("Something Went Wrong!")
    }
})