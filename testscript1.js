document.addEventListener("DOMContentLoaded", function () {
    // 登录表单
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");

    // 预定义账户、密码和头像信息
    const predefinedAccounts = {
        "123": {
            password: "123",
        },
        "Taloma": {
            password: "123",
            avatar: "https://wuming76.github.io/wuming761.github.io/images/newlogo_%E6%9C%89%E9%A1%8F%E8%89%B2%E7%B2%97%E7%B7%9A%E6%A2%9D_%E9%BB%83%E8%89%B2_%E5%9C%93%E5%BD%A2.png"
        },
        // 在这里添加更多账户、密码和头像信息
    };

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // 阻止表单提交刷新页面

            const usernameInput = document.getElementById("username");
            const passwordInput = document.getElementById("password");

            const enteredUsername = usernameInput.value;
            const enteredPassword = passwordInput.value;

            if (predefinedAccounts[enteredUsername] && predefinedAccounts[enteredUsername].password === enteredPassword) {
                // 用户名和密码正确，登录成功
                alert("登录成功");

                // 在这里将用户的登录状态和账号名字存储在 localStorage 中
                localStorage.setItem("userIsLoggedIn", "true");
                localStorage.setItem("username", enteredUsername);

                // 如果有头像信息，存储用户头像
                if (predefinedAccounts[enteredUsername].avatar) {
                    localStorage.setItem("userAvatar", predefinedAccounts[enteredUsername].avatar);
                }

                // 重定向回上一页或首页
                window.history.back(); // 返回上一页
            } else {
                // 用户名或密码不正确，显示错误消息
                alert("用户名或密码不正确");
            }
        });
    } else {
        console.error("未找到登录表单元素");
    }

    // 检查用户是否已登录的示例
    const userIsLoggedIn = localStorage.getItem("userIsLoggedIn") === "true";
    const username = localStorage.getItem("username");
    const userAvatar = localStorage.getItem("userAvatar");

    const loginStatusElement = document.getElementById("login-status");
    const starRatingArea = document.getElementById("star-rating");
    const messageInput = document.getElementById("message-text");
    const postButton = document.getElementById("post-message");

    if (!userIsLoggedIn) {
        // 如果用户未登录，隐藏星星和留言框
        starRatingArea.style.display = "none";
        messageInput.style.display = "none";
        postButton.style.display = "none";
    }

    if (userIsLoggedIn) {
        const userAvatarElement = document.getElementById("user-avatar");

        if (userAvatar) {
            userAvatarElement.src = userAvatar;
        } else {
            userAvatarElement.src = "默认头像URL"; // 设置默认头像URL，替代<i class>的部分
        }

        loginStatusElement.innerHTML = `
            <img id="user-avatar" src="${userAvatar}" alt="User Avatar">
            <span id="username-display">${username}</span>
        `;
    } else {
        loginStatusElement.innerHTML = '<a href="https://www.figma.com/proto/yQ3G2LpyJ2Kuzrw6vB7qHD/TALOMA%E7%B6%B2%E7%AB%99?type=design&node-id=880-179&t=aXFtTHDdyOREwnnH-0&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=1%3A3">注冊</a> | <a href="login.html">登录</a>';
    }

    // 处理登出按钮点击事件
    logoutButton.addEventListener("click", function () {
        // 执行注销操作
        localStorage.setItem("userIsLoggedIn", "false");
        localStorage.removeItem("username");
        localStorage.removeItem("userAvatar");
        window.location.reload(); // 刷新页面以更新登录状态显示
    });

    // 处理留言区的示例
    const messagesArea = document.getElementById("messages");

    // 初始化星星评分区域
    initializeStarRating();

    function initializeStarRating() {
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.setAttribute("data-rating", i);
            star.addEventListener("click", handleStarClick);
            starRatingArea.appendChild(star);
        }
    }

    function handleStarClick() {
        const selectedRating = this.getAttribute("data-rating");
        const stars = document.querySelectorAll(".star");

        stars.forEach((star, index) => {
            if (index < selectedRating) {
                star.classList.add("filled-star");
            } else {
                star.classList.remove("filled-star");
            }
        });
    }

    postButton.addEventListener("click", function () {
    const messageText = messageInput.value;
    const selectedStars = document.querySelectorAll(".star.filled-star");
    const rating = selectedStars.length;

    if (userIsLoggedIn && messageText.trim() !== "" && rating > 0) {
        const senderUsername = localStorage.getItem("username");
        const senderAvatar = localStorage.getItem("userAvatar");

        const newMessage = document.createElement("div");
        newMessage.className = "message";

        const messageHeader = document.createElement("div");
        messageHeader.className = "message-header";

        const avatarElement = document.createElement("div");
        avatarElement.className = "message-avatar";

        if (senderAvatar) {
            const avatarImage = document.createElement("img");
            avatarImage.src = senderAvatar;
            avatarImage.style.maxWidth = "20px";
            avatarImage.style.maxHeight = "20px";
            avatarElement.appendChild(avatarImage);
        } else {
            avatarElement.style.color = "#005eff";
            avatarElement.innerHTML = '<i class="fa-solid fa-user"></i>';
        }

        const usernameElement = document.createElement("span");
        usernameElement.textContent = senderUsername;
        usernameElement.className = "message-username";

        // 显示星星评分
        const ratingElement = document.createElement("span");
        ratingElement.innerHTML = "⭐".repeat(rating);

        const messageContent = document.createElement("p");
        messageContent.textContent = messageText;

        messageHeader.appendChild(avatarElement);
        messageHeader.appendChild(usernameElement);
        messageHeader.appendChild(ratingElement); // 将星星评分添加到消息头部
        newMessage.appendChild(messageHeader);
        newMessage.appendChild(messageContent);

        messagesArea.insertBefore(newMessage, messagesArea.firstChild);

        // 存储留言和星星评分
        saveMessage(senderUsername, messageText, senderAvatar, rating);

        // 重置星星选择到初始状态
        const stars = document.querySelectorAll(".star");
        stars.forEach(star => star.classList.remove("filled-star"));

        messageInput.value = "";
        updateMessageCounter();
    } else {
        alert("至少選擇一个星星。");
    }
});

    // 从本地存储加载留言
    loadMessages();

    function saveMessage(username, message, avatar, rating) {
        const messages = getMessages();
        messages.push({ username, message, avatar, rating });
        localStorage.setItem("messages", JSON.stringify(messages));
    }

    function loadMessages() {
        const messages = getMessages();
        messages.reverse();
        messages.forEach(messageData => {
            const { username, message, avatar, rating } = messageData;
            createMessage(username, message, avatar, rating);
        });
        updateMessageCounter();
    }

    function getMessages() {
        const messages = localStorage.getItem("messages");
        return messages ? JSON.parse(messages) : [];
    }

    function createMessage(username, message, avatar, rating) {
        const newMessage = document.createElement("div");
        newMessage.className = "message";

        const messageHeader = document.createElement("div");
        messageHeader.className = "message-header";

        const avatarElement = document.createElement("div");
        avatarElement.className = "message-avatar";

        if (avatar) {
            const avatarImage = document.createElement("img");
            avatarImage.src = avatar;
            avatarImage.style.maxWidth = "20px";
            avatarImage.style.maxHeight = "20px";
            avatarElement.appendChild(avatarImage);
        } else {
            avatarElement.style.color = "#005eff";
            avatarElement.innerHTML = '<i class="fa-solid fa-user"></i>';
        }

        const usernameElement = document.createElement("span");
        usernameElement.textContent = username;
        usernameElement.className = "message-username";

        // 显示星星评分
        const ratingElement = document.createElement("span");
        ratingElement.innerHTML = "⭐".repeat(rating);

        const messageContent = document.createElement("p");
        messageContent.textContent = message;

        messageHeader.appendChild(avatarElement);
        messageHeader.appendChild(usernameElement);
        messageHeader.appendChild(ratingElement); // 将星星评分添加到消息头部
        newMessage.appendChild(messageHeader);
        newMessage.appendChild(messageContent);

        messagesArea.appendChild(newMessage);
    }

    function updateMessageCounter() {
        const messages = getMessages();
        const messageCounter = document.getElementById("message-counter");

        if (messageCounter) {
            messageCounter.textContent = messages.length;
        }
    }
});
