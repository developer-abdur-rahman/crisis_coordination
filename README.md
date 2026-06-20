<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">I just finish learning the fundamentals of Nest.js. And by this project I want to gain real world experience on Nest.js project.</p>

# Crisis Coordination Platform (Backend Only)

## Overview

A platform where people affected by a crisis can create emergency requests and volunteers can claim and resolve them.

This project is backend-only and serves as a learning project for NestJS.

---

# Roles

## Victim

Can:

- Register/Login - ✅
- Create emergency requests - ✅
- View own requests - ✅
- Upload evidence/images
- Receive notifications

## Volunteer

Can:

- Register/Login - ✅
- View open requests - ✅
- Claim requests - ✅
- Mark requests as resolved - ✅
- Receive notifications

## Coordinator

Can:

- View all requests - ✅
- Reassign requests
- Change priorities
- Monitor system activity

## Admin

Can:

- Manage users  - ✅
- View system statistics
- Access all resources

---

# Request Lifecycle

Draft → Open → Claimed → In Progress → Resolved

Rules:

- Victim creates request → Open
- Volunteer claims request → Claimed
- Volunteer starts work → In Progress
- Volunteer resolves request → Resolved

Only Coordinators and Admins can manually override statuses.

---

# Core Features

## Authentication

Endpoints:

POST /auth/register - ✅

POST /auth/login - ✅

POST /auth/refresh

POST /auth/logout

Requirements:

- Access Token
- Refresh Token
- Password Hashing
- JWT Authentication

---

## User Management

Endpoints:

GET /users/me - ✅

GET /users/ - ✅

PATCH /users/me - ✅

GET /users - ✅

Admin only:
DELETE /users/ - ✅

Fields:

- id
- name
- email
- password
- role
- createdAt

---

## Emergency Requests

Endpoints:

POST /requests - ✅

GET /requests - ✅

GET /requests/

PATCH /requests/ - ✅

DELETE /requests/ - ✔️

Fields:

- id
- title
- description
- location
- priority
- status
- createdBy
- claimedBy
- createdAt

Priority:

- low
- medium
- high
- critical

Status:

- open
- claimed
- in_progress
- resolved

---

## Claim Request

Endpoints:

POST /requests//claim - ✅

POST /requests//start - ✅

POST /requests//resolve - ✅

Business Rules:

- Only volunteers can claim - ✅
- Claimed request cannot be claimed again - ✅
- Resolver must be claimant - ✅

---

## File Upload

Endpoint:

POST /requests//upload

Allowed:

- jpg
- jpeg
- png

Store:

- local storage (initially)

Fields:

- fileName
- fileUrl
- uploadedBy

---

## Notifications

Notification Types:

- Request Claimed
- Request Resolved
- Priority Changed

Endpoints:

GET /notifications

PATCH /notifications//read

Fields:

- id
- userId
- message
- read
- createdAt

---

## Activity Logs

Store system events:

Examples:

- User Registered
- Request Created
- Request Claimed
- Request Resolved

Fields:

- id
- actorId
- action
- metadata
- createdAt

Admin can view logs.

---

# WebSocket Events

request.created

request.claimed

request.resolved

notification.created

Clients receive updates in real-time.

---

# Scheduled Jobs

Every hour:

- Find requests older than 24 hours
- Mark them as stale

Every day:

- Generate system statistics

---

# Caching

Cache:

GET /requests

GET /requests/

TTL: 60 seconds

Invalidate cache when:

- Request created
- Request updated
- Request resolved

---

# Rate Limiting

Limit:

- Login attempts
- Request creation

Example:

10 requests per minute

---

# Error Format

Every error should return:

{
"success": false,
"message": "Human readable message",
"statusCode": 400
}

---

# Logging

Log:

- Request Method
- URL
- Response Time
- User ID (if authenticated)

---

# Database Tables

users

requests

request_attachments

notifications

activity_logs

---

# Non-Goals

Do NOT build:

- Frontend
- Maps integration
- SMS
- Email sending
- Payment system
- Multi-language support
- Analytics dashboard
- AI features

Keep the project focused on NestJS fundamentals.

---

# Definition of Done

The project is complete when:

- Authentication works
- Role-based authorization works
- Request lifecycle works
- WebSocket updates work
- Notifications work
- File uploads work
- Cron jobs work
- Caching works
- Rate limiting works
- Logging works
- Exception handling is centralized

No frontend required.
