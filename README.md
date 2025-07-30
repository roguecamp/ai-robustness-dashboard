# AI Robustness Dashboard

The AI Robustness Dashboard is a tool for assessing and visualizing the robustness of AI systems across key pillars: People, Strategy, Data, Legal, Solution, and Security. It provides a structured way to evaluate the maturity of your AI systems and identify areas for improvement.

![AI Robustness Dashboard Screenshot](public/images/screenshot.png)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Comprehensive Assessment:** Evaluate your AI systems against a set of key practices in six different pillars.
- **Visual Dashboard:** Visualize the results of your assessment in an easy-to-understand dashboard.
- **Data Persistence:** Save your assessments to a Supabase backend and track your progress over time.
- **Shareable Reports:** Share your assessment results with your team and stakeholders.

## Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/roguecamp/ai-robustness-dashboard.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your Supabase backend and add your credentials to a `.env.local` file.
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Run the development server
    ```sh
    npm run dev
    ```

## Usage

1.  Open the application in your browser.
2.  Create a new project and assessment.
3.  Rate each of the key practices in the six pillars.
4.  Save your assessment.
5.  View your results in the dashboard.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
