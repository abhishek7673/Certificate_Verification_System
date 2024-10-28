# Certify-App

## Description
The Certificate Verification System is designed to streamline the process of issuing and verifying internship certificates. This web application enables administrators to upload student data via an Excel sheet, which includes details such as certificate ID, student name, internship domain, and internship start and end dates. Once the data is uploaded, students can search for their certificate using their certificate ID. The system then displays their certificate with all the relevant information prefilled and allows students to download it. This project leverages the MERN stack (MongoDB, Express.js, React.js, and Node.js) to ensure efficient data handling and a seamless user experience.

## Features
- Administrator can upload bulk student data in excel file.
- Certificate Generation - Automatically populate certificates with student information.
- All student information and certificates are securely stored in a MongoDB database.
- Encrypted login and access controls

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/Vivek01233210/Certify-App
    ```
3. Install dependencies run the command at the root of the project to install all the dependencies:
    ```sh
    npm run install
    ```
4. Start the application:
    ```sh
    npm run dev
    ```