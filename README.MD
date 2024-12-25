# Online Newspaper Web Application

A full-stack web application for managing and publishing online news articles with different user roles and premium content features.

## Features

### Reader Features
- Browse articles by categories and tags
- View article details with comments
- Search functionality
- Premium content access for subscribers
- User profile management

### Writer Features
- Create and edit articles
- Rich text editor with image upload
- Article status tracking
- Category assignment
- Premium content flagging

### Editor Features
- Review pending articles
- Approve or reject submissions with feedback
- Manage article tags
- Monitor published content
- Category-based content management

## Technology Stack

### Frontend
- EJS (Embedded JavaScript templates)
- Bootstrap 4.6
- TinyMCE Editor
- jQuery

### Backend
- Node.js
- Express.js
- MySQL (with Knex.js query builder)
- Express Session for authentication

### Core Dependencies
- `express` - Web application framework
- `express-session` - Session middleware
- `express-validator` - Validation middleware 
- `express-ejs-layouts` - Layout support for EJS templates
- `ejs` - Template engine
- `mysql2` - MySQL database driver
- `knex` - SQL query builder
- `bcrypt` - Password hashing
- `multer` - File upload handling
- `dotenv` - Environment variable management
- `axios` - HTTP client
- `date-fns` - Date utility library

### Authentication
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth2.0 strategy
- `passport-facebook` - Facebook authentication strategy

### Development Tools
- `nodemon` - Development server with auto-reload

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── middlewares/    # Custom middleware functions
├── models/        # Database models
├── public/        # Static files (CSS, JS, images)
├── routes/        # Route definitions
├── services/      # Business logic
├── views/         # EJS templates
└── server.js      # Application entry point
```

## Setup and Installation

1. Clone the repository
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```
NODE_ENV=development
HOST_NAME=localhost
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PWD=your_password
DB_NAME=OnlineNewspaper
TINY_API_KEY=your_tinymce_api_key
```

4. Set up the database
```bash
# Import the database schema
mysql -u your_username -p < database_query.sql
```

5. Start the development server
```bash
npm start
```

## User Roles

- **Reader**: Browse articles, comment, and access premium content (if subscribed)
- **Writer**: Create and edit articles
- **Editor**: Review and manage content
- **Admin**: System administration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.