// Sarkar-MD
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { data: null, error: null });
});

app.get("/stalk", async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.render("index", { data: null, error: "Please enter a username" });
    }

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/stalk/tiktok?username=${username}`);
        const { user, stats } = response.data.data;

        const profileData = {
            profilePic: user.avatarLarger, 
            username: `@${user.uniqueId}`,
            nickname: user.nickname,
            verified: user.verified ? "Yes ✅" : "No ❌",
            region: user.region,
            bio: user.signature || "No bio available.",
            bioLink: user.bioLink?.link || "No link available.",
            followers: stats.followerCount.toLocaleString(),
            following: stats.followingCount.toLocaleString(),
            likes: stats.heartCount.toLocaleString(),
            videos: stats.videoCount.toLocaleString(),
            accountCreated: new Date(user.createTime * 1000).toLocaleDateString(),
            privateAccount: user.privateAccount ? "Yes 🔒" : "No 🌍",
            profileUrl: `https://www.tiktok.com/@${user.uniqueId}`,
        };

        res.render("index", { data: profileData, error: null });
    } catch (error) {
        res.render("index", { data: null, error: "Invalid username or API issue." });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// POWERED BY BANDAHEALI
