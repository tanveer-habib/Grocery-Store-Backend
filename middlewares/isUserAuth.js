import jwt from "jsonwebtoken";

const isUserAuth = async (req, res, next) => {
    const { userToken } = req.cookies;
    if (!userToken) {
        return res.json({ success: false, message: "Not Authorized" });
    };

    try {
        const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET);
        if (decodedToken.id) {
            if (!req.body) {
                req.body = {};
            }
            req.body.userId = decodedToken.id
        } else {
            return res.json({ success: false, message: "Not Authorized" });
        }
        next();
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

export default isUserAuth;