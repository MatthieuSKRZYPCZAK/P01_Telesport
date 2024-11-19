# Olympic Games

This project is an Angular-based web application developed for TéléSport to enhance their coverage of the Olympic Games with interactive features. 
The application provides a dashboard for visualizing past Olympic data and a detail page for specific country insights.

## Prerequisites

Before starting, ensure you have the following installed:
- Node.js (version 14+ recommended)
- Angular CLI (v18.0.3 or later)

## Getting Started

1. Clone repository:  `git clone https://github.com/MatthieuSKRZYPCZAK/P01_Telesport.git`
2. Navigate to the project directory: `cd P01_Telesport`
3. Install dependencies: `npm install`
4. Start the Development server: `ng serve`

The app will be accessible at http://localhost:4200. 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Features

- Interactive Dashboard: Displays a pie chart of medals by country.
- Country Detail Page: Displays a line chart of medals won over the years and other country specific details.
- Responsive Design: Fully functional on both mobile and desktop devices.

## Charts Library

This project uses the @swimlane/ngx-charts library (version 20.5.0) for rendering dynamic and interactive charts.

### Key Features:
- Used for creating the pie chart on the dashboard page (medals by country).
- Used for creating the line chart on the detail page (medals over time for a specific country).

Visit the official [ngx-charts documentation](https://swimlane.gitbook.io/ngx-charts).



