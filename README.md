# Katie & Alex's Wedding Guestbook

A beautiful digital wedding guestbook that combines the charm of a traditional book with modern features. Built with React and styled-components, this application provides an interactive way for wedding guests to share their memories and well-wishes.

🔗 **Deployed Site**: [https://snappily-ever-after.netlify.app/](https://snappily-ever-after.netlify.app/)

## Features

📖 Book-like interface with page-turning animations  
🔐 Secure authentication system with separate admin and guest access  
📸 Photo upload functionality with AWS S3 storage  
💝 Message submission capability  
🖼️ Photos appear on individual “A Snap in Time” pages  
🗂️ All uploaded photos are also shown in a gallery called "Snappily Collected Moments"  
🎉 "Snappily Ever After" final message page  
✨ Celebratory confetti animation on login  
⌨️ Keyboard navigation support  

👑 Admin dashboard includes:  
- View memory statistics - including searchable list of contributors
- Gallery management - download photos only or download the whole memory - or delete
- Update admin and guest credentials  
- Delete or download individual images from guestbook gallery  

> ❗ Currently, there is **no export of all guestbook data**. Admin can download or delete images individually.

## For Users

### Getting Started
1. Open the guestbook in your web browser
2. Enter the event password provided by Katie and Alex
3. Enjoy the celebratory confetti! 🎉

### Navigation
- Use the arrow buttons at the bottom of the screen to turn pages  
- Alternatively, use your keyboard's left and right arrow keys  
- A navigation hint appears for a few seconds upon login

### Sharing Your Memories
1. Navigate to the **Share Your Memory** page (/)
2. Enter your name (required), write a message (optional), and/or upload a photo (optional)
3. Click "Submit Memory"
4. Your memory will appear as an individual page titled **A Snap in Time**
5. All uploaded images are also shown on the **Snappily Collected Moments** gallery page

## For Administrators

### Admin Dashboard
Access by:
- Clicking **Admin Dashboard** link (top-right corner after admin login)
- Using admin credentials

Dashboard features:
- View count of uploaded memories
- Change admin and guest credentials
- Delete or download images and/or memories from Gallery Management
- Delete or download individual images from the gallery

## Technical Details

### Stack
**Frontend**  
- React + Vite  
- styled-components for styling  
- react-pageflip for book animations  
- react-confetti for celebrations  
- Axios for API communication

**Backend**  
- Django REST Framework  
- AWS S3 for image storage  
- PostgreSQL database  
- Token-based authentication

### Deployment
- **Frontend**: Deployed on Netlify  
- **Backend**: Deployed on Heroku  
- **Media Storage**: AWS S3

### Environment Variables
Frontend `.env`:
```
VITE_API_URL=https://[your-backend-url]
VITE_AWS_BUCKET_URL=https://[your-s3-bucket-url]
```

### Getting Started (Development)
1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Set up environment variables
4. Start the development server:
```
npm run dev
```

## Security Features
- Separate authentication for admin and guest access
- Secure credential management
- AWS S3 for secure image storage
- Token-based API authentication

## License
This project is private and created specifically for Katie and Alex's wedding.
