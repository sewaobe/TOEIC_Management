# TOEIC Management

A comprehensive admin and content management interface for the TOEIC learning platform. Built with React, TypeScript, and modern web technologies for efficient content creation and platform management.

## 🚀 Features

- **Content Management**: Create and manage TOEIC lessons, tests, and vocabulary
- **User Administration**: Manage user accounts, roles, and permissions
- **Test Creation**: Build and configure TOEIC practice tests
- **Vocabulary Management**: Add and organize vocabulary lists and flashcards
- **Analytics Dashboard**: Monitor platform usage and user progress
- **Media Management**: Upload and organize multimedia content
- **Collaborator Tools**: Multi-user content creation workflows
- **Real-time Collaboration**: Live editing and notifications
- **Export/Import**: Bulk content operations and data migration

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.0.1
- **UI Library**: Material-UI (MUI) 7.3.1 with date pickers
- **State Management**: Redux Toolkit 2.8.2
- **HTTP Client**: Axios 1.11.0
- **Routing**: React Router DOM 6.30.1
- **Form Handling**: React Hook Form 7.62.0 with Zod validation
- **Rich Text Editors**: Milkdown 7.15.5 and Quill 1.3.7
- **Charts**: MUI X Charts 8.11.3
- **Real-time Communication**: Socket.IO Client 4.8.1
- **Date Handling**: date-fns 4.1.0
- **Animations**: Framer Motion 12.23.12
- **Notifications**: Sonner 2.0.7
- **File Upload**: Firebase SDK 9.23.0
- **Local Storage**: IndexedDB with idb-keyval

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- TOEIC Server running on port 5000
- Admin access credentials

## 🚀 Getting Started

### Installation

1. Clone the repository and navigate to the management directory:
```bash
cd TOEIC_management
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── views/              # Page components and layouts
├── stores/             # Redux store slices
├── viewmodels/         # Business logic hooks
├── utils/              # Utility functions
├── constants/          # Application constants
└── types/              # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_FIREBASE_*` | Firebase configuration for file uploads | Yes |

### Tailwind CSS

Custom Tailwind configuration with extended utilities for 3D transforms, custom shadows, and color schemes optimized for admin interfaces.

### ESLint

ESLint configuration with TypeScript and React rules for code quality and consistency.

## 🌐 Key Features

### Content Management System

#### Test Management
- Create and edit TOEIC practice tests
- Configure test settings and scoring
- Manage question banks and answer keys
- Bulk import/export test data

#### Lesson Management
- Create interactive lessons with multimedia
- Organize lessons by topics and difficulty
- Track lesson completion and user engagement

#### Vocabulary Management
- Build vocabulary lists and categories
- Create flashcards with audio support
- Import vocabulary from external sources

### User Administration

#### User Management
- View and manage user accounts
- Assign roles and permissions
- Monitor user activity and progress
- Handle user support requests

#### Analytics Dashboard
- Platform usage statistics
- User engagement metrics
- Test performance analytics
- Content effectiveness reports

### Media Management

#### File Upload
- Firebase integration for secure file storage
- Support for images, audio, and video files
- Automatic file optimization and CDN delivery

#### Content Organization
- Folder-based media organization
- Metadata management and tagging
- Bulk upload and management tools

### Collaboration Features

#### Multi-user Editing
- Real-time collaborative content creation
- Version control and change tracking
- Comment and review system

#### Workflow Management
- Content approval workflows
- Task assignment and tracking
- Notification system for updates

## 🔐 Security & Permissions

- **Role-based Access Control**: Different permission levels for admins, editors, and reviewers
- **Secure File Uploads**: Firebase security rules for media access
- **API Authentication**: JWT tokens for secure API communication
- **Input Validation**: Comprehensive form validation with Zod schemas

## 📊 Analytics & Reporting

### Dashboard Metrics
- Active users and session data
- Content engagement statistics
- Test completion rates
- User progress tracking

### Reporting Tools
- Custom report generation
- Data export capabilities
- Performance trend analysis
- User behavior insights

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- Configure production API endpoints
- Set up Firebase production project
- Configure CDN for media assets
- Set up monitoring and logging

### Docker Support
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🤝 Contributing

1. Follow the established coding standards
2. Use TypeScript for all new code
3. Implement proper error handling
4. Add tests for new features
5. Update documentation

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For technical support and questions, please contact the development team.
