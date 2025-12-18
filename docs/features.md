# Feature Tracker

## Authentication & User Management
- [ ] **User Onboarding**
    - [x] **Sign Up**: Register a new account using Email/Password.
        - [x] Backend API integration: POST /users (create user)
        - [x] UI wiring to call API from sign-up form and auto sign-in via Firebase.
    - [x] **Sign In**: Authenticate existing users.
    - [x] **Sign Out**: Securely log out current session.
    - [x] **Auth State Watching (Firebase)**: Custom React hook to observe auth session and expose user/loading flags

## Marketplace Core
- [ ] **Discovery & Browsing**
    - [x] **Item Listing**: Image-first feed at `/market` surfaces listings from the feed service with price overlays and titles.
- [ ] **Selling (Vendor Flow)**
    - [ ] **Create Listing**: Form to input item details, price, and upload images.
- [ ] **Buying (Customer Flow)**
    - [ ] **Purchase Item**: Checkout process to buy a listed item.

## Social & Communication
- [ ] **Direct Messaging**
        - [x] **Chat System (MVP)**: Persistent messaging between buyers and sellers.
    - [x] **Messages Inbox**: Latest conversations list at `/market/messages` with avatar, name, and truncated preview.
    - [x] **Public User Profile View**: SSR profile page at `/market/users/[userId]` showing avatar and name.

## AI Integrations
- [ ] **Generative AI Feature**
    - [ ] **AI Assistant**: Implementation of a generative AI feature (e.g., auto-generating item descriptions from image/title).

## Website Structure & UX
- [x] **i18n**
  - [x] **Language Switcher**
- [x] **Root Layout**
  - [x] **Header**: Includes navigation, profile avatar, and language switcher. 
  - [x] **Footer**: Includes static links.
