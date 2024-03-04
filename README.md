# Exercise Tracker

## Introduction
An API to create users and exercises for users. Also fetches users and exercise logs for users.

API Endpoints:
- POST '/api/users' - username
- POST '/api/users/:_id/exercises' - _id, description, duration, date(optional)
- GET '/api/users' - List of users in JSON
- GET '/api/users/:_id/logs?[from][&to][&limit]' - User data with exercise logs(with or without filters) in JSON

## Reference
Project submission for [freeCodeCamp's Backend Development and APIs Course](https://www.freecodecamp.org/learn/back-end-development-and-apis/).