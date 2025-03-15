# Katie & Alex's Wedding Guestbook

A beautiful digital wedding guestbook that combines the charm of a traditional book with modern features. Built with React and styled-components, this application provides an interactive way for wedding guests to share their memories and well-wishes.

## Features

- 📖 Book-like interface with page-turning animations
- 🔐 Secure authentication system with separate admin and guest access
- 📸 Photo upload functionality with AWS S3 storage
- 💝 Message submission capability
- 🖼️ Gallery view for photos and messages
- ✨ Celebratory confetti animation on login
- ⌨️ Keyboard navigation support
- 📱 Responsive design for various screen sizes
- 👑 Admin dashboard with:
  - Photo and message statistics
  - Credential management
  - Data export functionality
  - Guest access control

## For Users

### Getting Started

1. Open the guestbook in your web browser
2. Enter the event password provided by Katie and Alex
3. Enjoy the celebratory confetti! 🎉

### Navigation

- Use the arrow buttons at the bottom of the screen to turn pages
- Alternatively, use your keyboard's left and right arrow keys
- A helpful navigation hint will appear for the first few seconds

### Sharing Your Memories

1. Navigate to the "Share Your Memory" page
2. Upload a photo and/or write a message
3. Your contribution will appear in the gallery for all guests to see

## For Administrators

### Admin Dashboard

Access the admin dashboard by:
1. Clicking the "Admin Dashboard" link (top-right corner when logged in as admin)
2. Using admin credentials to log in

Features include:
- View total photos and messages statistics
- Update admin username and password
- Manage guest access credentials
- Export all guestbook data

## Technical Details

### Stack

#### Frontend
- React + Vite
- styled-components for styling
- react-pageflip for book animations
- react-confetti for celebrations
- Axios for API communication

#### Backend
- Django REST Framework
- AWS S3 for image storage
- PostgreSQL database
- Token-based authentication

### Deployment

- Frontend: Deployed on Vercel
- Backend: Deployed on Heroku
- Media Storage: AWS S3

### Environment Variables

The application requires the following environment variables:

Frontend (.env):
```
VITE_API_URL=https://[your-backend-url]
VITE_AWS_BUCKET_URL=https://[your-s3-bucket-url]
```

### Getting Started (Development)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Security Features

- Separate authentication for admin and guest access
- Secure credential management
- AWS S3 for secure image storage
- Token-based API authentication

## License

This project is private and created specifically for Katie and Alex's wedding.
