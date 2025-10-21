\# Memberworks - People \& Programs Management System



A full-stack application for managing people and programs, built with Angular (Frontend) and .NET 8 (Backend).



\## Features



\- People Management (Create, Read, Update, Delete)

\- Program Management (Create, Read, Update, Delete)

\- Role-based system (Admin, Member, Coach)

\- Full CRUD operations with validation

\- Angular Material UI



\## Tech Stack



\### Backend

\- .NET 8 Web API

\- Entity Framework Core

\- PostgreSQL Database

\- RESTful API design



\### Frontend

\- Angular 17+

\- Nx Monorepo

\- Angular Material

\- Reactive Forms

\- TypeScript



\## Prerequisites



\- .NET 8 SDK

\- Node.js (v18+)

\- PostgreSQL

\- Visual Studio 2022 or VS Code



\## Setup Instructions



\### Backend Setup



1\. Navigate to the backend directory:

```bash

cd backend/Memberworks.Api

```



2\. Update the connection string in `appsettings.json` with your PostgreSQL credentials



3\. Run database migrations:

```bash

dotnet ef database update

```



4\. Run the backend:

```bash

dotnet run

```



The API will be available at `https://localhost:7272`



\### Frontend Setup



1\. Navigate to the frontend directory:

```bash

cd frontend/memberworks

```



2\. Install dependencies:

```bash

npm install

```



3\. Update the proxy configuration in `apps/web/proxy.conf.json` to match your backend URL



4\. Start the development server:

```bash

npx nx serve web --proxy-config apps/web/proxy.conf.json

```



The application will be available at `http://localhost:4200`



\## Usage



1\. \*\*People Management\*\*: 

&nbsp;  - Click "People" to view, add, edit, or delete people

&nbsp;  - Fill in first name, last name, email, and select a role

&nbsp;  - Click "Create" to add a new person



2\. \*\*Program Management\*\*:

&nbsp;  - Click "Programs" to view, add, edit, or delete programs

&nbsp;  - Enter program name, description, start date, and end date

&nbsp;  - Click "Create" to add a new program



\## Project Structure

```

memberworks/

├── backend/

│   └── Memberworks.Api/

│       ├── Controllers/

│       ├── Models/

│       ├── Data/

│       └── Program.cs

└── frontend/

&nbsp;   └── memberworks/

&nbsp;       └── apps/web/src/app/

&nbsp;           ├── pages/

&nbsp;           ├── services/

&nbsp;           ├── models/

&nbsp;           └── app.module.ts

```



\## API Endpoints



\### People

\- `GET /api/people` - Get all people

\- `POST /api/people` - Create a person

\- `PUT /api/people/{id}` - Update a person

\- `DELETE /api/people/{id}` - Delete a person



\### Programs

\- `GET /api/programs` - Get all programs

\- `POST /api/programs` - Create a program

\- `PUT /api/programs/{id}` - Update a program

\- `DELETE /api/programs/{id}` - Delete a program



\## Development Notes



\- Role field uses numeric values: 0 = Member, 1 = Admin, 2 = Coach

\- Frontend uses proxy configuration to communicate with backend API

\- Entity Framework Core handles database operations

\- Angular Material provides consistent UI components



\## Author



Yash



\## Time Spent



Approximately 5-7 hours

