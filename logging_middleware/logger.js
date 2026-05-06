const axios = require("axios");

async function Log(stack, level, packageName, message, token) {
    try {
        const response = await axios.post(
            "http://20.207.122.201/evaluation-service/logs",
            {
                stack,
                level,
                package: packageName,
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response.data);

    } catch (err) {
        console.log("Logging failed");
    }
}

module.exports = Log;