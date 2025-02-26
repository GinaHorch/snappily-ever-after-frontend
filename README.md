# Katie & Alex's Wedding Guestbook

A beautiful digital wedding guestbook that combines the charm of a traditional book with modern features. Built with React and styled-components, this application provides an interactive way for wedding guests to share their memories and well-wishes.

## Features

- 📖 Book-like interface with page-turning animations
- 🔐 Password-protected access for wedding guests
- 📸 Photo upload functionality
- 💝 Message submission capability
- 🖼️ Gallery view for photos and messages
- ✨ Celebratory confetti animation on login
- ⌨️ Keyboard navigation support
- 📱 Responsive design for various screen sizes

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

## For Developers

### Technical Stack

- React + Vite
- styled-components for styling
- react-pageflip for book animations
- react-confetti for celebrations

### Important Note

Currently, all data (photos and messages) is stored in local state only. This means:
- Data will not persist between page refreshes
- Uploads are temporary
- Multiple users cannot see each other's contributions

This is temporary and will be updated once the backend is connected. The backend will handle:
- Persistent data storage
- Real-time updates between users
- Secure file storage for photos
- User session management

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Currently, the application uses a hardcoded event password. In production, this should be moved to an environment variable.

## Future Enhancements

- Backend integration for persistent data storage
- Real-time updates when new content is added
- Image optimization and compression
- Download functionality for photos
- Admin panel for content moderation

## License

This project is private and created specifically for Katie and Alex's wedding.
