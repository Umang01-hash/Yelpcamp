# Yelpcamp

YelpCamp is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.

*TLive Site* : (https://yelpcamp-umang01.herokuapp.com/)

## Build :

This project was Built on a MongoDB/Express/Node stack, utilizing RESTful architecture with the Bootstrap 4 CSS framework for styling , Passport.js was used to handle authentication.
The app performs CRUD operations for users, the campground and the comments. These pieces are referenced within the database through various associations. Actionable commands are displayed dynamically on the site (edit/delete) for campground and comments, depending on a user’s authorization/ownership. Flash messages handle error and success messages to provide the visitor with feedback.

## Features :

### 1. Authentication
 
  a) User signup with username, password and invitation code

  b) User login with username and password

  c) Admin login with admin username and password
  
### 2. Authorization
  
  a) One cannot create new posts or view user profile without being authenticated

  b) One cannot edit or delete existing posts and comments created by other users

  c) Admin can manage all posts and comments
 
### 3.Flash messages responding to users’ interaction with the app

### 4. Responsive web design

### 5. Manage campground posts with basic functionalities:

  a)Create, edit and delete posts and comments
  
  b)Upload campground photos
  
  c)Search existing campgrounds
  
