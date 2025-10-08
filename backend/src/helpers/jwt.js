import jwt from "jsonwebtoken"
import createError from "http-errors"

const jwtAccessToken = (user_id) => {
    return new Promise((resolve, reject) => {
      const payload = { user_id };
      const options = {
        expiresIn: "1h",
        issuer: "crowdfund.com",
        audience: user_id,
      };
  
      jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, options, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  };

  const verifyJwtToken = (req, res, next) => {
    console.log("Cookie kha lo:", req.cookies);
    const token = req.cookies?.accessToken;
    if (!token) {
    console.log("No accessToken cookie found, returning 401");
    return next(createError.Unauthorized());
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, payload) => {
    console.log("Payload after verify:", payload);
    if (err) {
    console.log("Error in jwt verify:", err.message);
    return next(createError.Unauthorized());
    }
    if (payload.user_id === req.query.userId) {
      next();
    } else {
      console.log("UserId not matching in token and req returning 401");
      return next(createError.Unauthorized());
    }    
    });
    };

const signRefreshToken = (user_id) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        
        const options = {
            expiresIn: "1h",
            issuer: "crowdfund.com",
            audience: user_id
        }
        jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, options, (err,token) => {
            if(err) 
                console.log(err.message)
            resolve(token)
        })
    })
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve,reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, payload) => {
            if(err)
                return next(createError.Unauthorized())
            const userId = payload.aud;
            resolve(userId)
        } )
    })
}
export {jwtAccessToken, verifyJwtToken, signRefreshToken, verifyRefreshToken};