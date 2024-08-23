# [EasyHR](https://easyhr.store)

The EasyHR Website is a comprehensive platform designed to streamline and simplify human resources management for organizations of all sizes. This web application provides a centralized hub for managing employee data, tracking attendance, processing payroll, and automating various HR tasks. It utilizes Java for the backend, and React with TypeScript for the frontend.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used
- **Backend:** Java , SpringBoot, SpringSecurity, SpringWeb, SpringData JPA, SpringEmail, SpringCloud Gateway, JWT, Amazon S3, Kubernetes, Docker
- **Frontend:** React, TypeScript

## Getting Started
 Demo images are shown below. For demo datas, the accounts given below can be used.
 
Superadmin 

- **Email:** admin
- **Password:** 123

Manager 

- **Email:** manager
- **Password:** 123

Employee 

- **Email:** employee@gmail.com
- **Password:** 123
  
Admin View;
![Ekran görüntüsü 2024-08-21 100250](https://github.com/user-attachments/assets/f2b80bf3-188d-48e5-ab9d-7309e2b3569f)

Manager View;
![image](https://github.com/user-attachments/assets/c88341cb-ce2c-4286-8bcb-d279dedbd6ed)

![Ekran görüntüsü 2024-08-21 100328](https://github.com/user-attachments/assets/c4120f4a-7ac2-459f-a82c-597c1600458c)

Employee View;
![Ekran görüntüsü 2024-08-21 100142](https://github.com/user-attachments/assets/eadc4c2e-2e81-415c-9f55-9eddd6730a2e)


To get a local copy of the project up and running, follow these simple steps.


### Prerequisites
Make sure you have the following installed on your machine:
- Java Development Kit (JDK)
- Node.js
- npm or yarn

## Installation

1. **Clone the repository:**
    ```sh
    https://github.com/candenizgumus/HumanResourcesApp.git
    ```
2. **Backend Setup:**
    - Navigate to the backend directory:
        ```sh
        cd HumanResourcesApp
        ```
    - Install dependencies and run the application:
        ```sh
        ./mvnw spring-boot:run
        ```
3. **Frontend Setup:**
    - Navigate to the frontend directory:
        ```sh
        cd HumanResourcesApp/human-resource-react
        ```
    - Install dependencies:
        ```sh
        npm install
        ```
    - Start the development server:
        ```sh
        npm start
        ```

## Usage
Once both the backend and frontend are running, you can access the application by navigating to `http://localhost:3000` in your web browser.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


