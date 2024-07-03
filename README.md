## Introduction
YelpCamp is a full-stack web application designed to allow users to share and review campgrounds. The application offers a user-friendly interface for adding, viewing, and reviewing campgrounds. It leverages modern web development technologies to provide a seamless user experience.

## Features
- User authentication and authorization.
- Add, edit, and delete campgrounds.
- Write and manage reviews for campgrounds.
- Responsive design using Bootstrap.
- Real-time updates using AJAX and JSON.
- Secure password management with bcrypt.
- Efficient data management with Mongoose.
- Interactive maps using MapTiler.
- Image storage and management with Cloudinary.

## Technologies Used
- **Frontend:** HTML, CSS, Bootstrap, AJAX, JSON, MapTiler
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** bcrypt
- **Image Storage:** Cloudinary
- **Other:** EJS for templating

## Installation
Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/YelpCamp.git
   cd YelpCamp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB:**
   Ensure you have MongoDB installed and running. Create a database named `yelpcamp`.

4. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL=mongodb://localhost:27017/yelpcamp
   CLOUD_NAME=yourCloudinaryCloudName
   API_KEY=yourCloudinaryKey
   API_SECRET=yourCloudinarySecret
   MAPTILER_API_KEY=yourMapTilerKey
   ```

5. **Run the application:**
   ```bash
   npm start
   ```

## Usage
- Open your browser and navigate to `http://localhost:3000` to start using YelpCamp.
- Register a new account or log in with an existing account.
- Add, edit, and delete campgrounds and reviews.
- Upload images to campgrounds using Cloudinary.
- View interactive maps of campground locations using MapTiler.

## Contributing
Contributions are welcome! If you have any issues or suggestions for improvements, please raise them in the issues section.
