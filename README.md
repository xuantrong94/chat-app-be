# CHAT APP USE SOCKET.IO

## Start date: 08/8/2024

## Backend process

1. libraries: express mongoose bcryptjs jsonwebtoken dotenv morgan cookie-parser helmet hpp express-mongoose-sanitizer  express-rate-limit express-validator slugify socket.io -D airbnb eslint prettier eslint-config-prettier eslint-plugin-airbnb eslint-plugin-import eslint-plugin-prettier
2. /src/app.js
  app = express()
3. main.js
  server = app.listen
4. .env
5. /src/config/env.config.js
  exports.module = config[env]
6. /src/utils/
  appError.js
  catchAsync.js
