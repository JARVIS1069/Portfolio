export const profile = {
    name: 'Arpeet Mahajan',
    role: 'AI / ML practitioner',
    location: 'Gurgaon, Haryana',
    bio: 'I build AI and machine learning solutions for real-world problems, learning by turning ideas into applications and creating meaningful value.',
    skills: [
        'Python', 'Java', 'SQL / MySQL', 'FastAPI', 'Flask', 'React', 'Docker',
        'Git', 'Power BI', 'Streamlit', 'Machine learning', 'RAG', 'AI agents',
        'LLMs', 'NLP', 'PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'Pandas'
    ]
}

export const projects = [
    {
        name: 'Multi-Agent AI Organization System',
        description: 'An 11-agent AI organization with role-based access, audit trails, a FastAPI backend, a React dashboard, and demand forecasting.',
        stack: ['Python', 'FastAPI', 'React + Vite', 'LightGBM', 'scikit-learn', 'pandas'],
        url: 'https://github.com/JARVIS1069/Company-AI',
        pages: [
            {
                title: 'The idea',
                text: 'A role-based multi-agent AI organization showing how agents collaborate through planning, execution, validation, approval, and release. A demand forecasting and inventory optimization pipeline is the working example.'
            },
            {
                title: 'How it works',
                steps: ['Plan', 'Prepare data', 'Forecast demand', 'Optimize inventory', 'Validate', 'Review', 'Approve', 'Release'],
                text: 'Eleven agents hand work to each other through structured messages, from President and VP down to Data Scientist, QA Validator and Release.'
            },
            {
                title: 'What is real',
                list: [
                    'A LightGBM model trained on realistic sales data, tested on a time-based split (MAPE about 12%)',
                    'QA re-reads the raw data and loads the saved model to run a live prediction',
                    'RBAC permissions enforced for every agent action',
                    'An audit trail of every message sent, received, or denied'
                ]
            },
            {
                title: 'Structure and API',
                list: [
                    'backend/: agents, event bus, RBAC, audit log, ML pipeline',
                    'frontend/: React + Vite dashboard',
                    'Endpoints: /org, /kickoff, /audit-log, /message, /history',
                    'Runs end-to-end from the dashboard or a standalone demo script'
                ]
            }
        ]
    },
    {
        name: 'Git Archaeologist',
        description: 'A Rust tool that reads Git history to surface team risk, code ownership, and bus-factor insights, with GitHub Actions checks.',
        stack: ['Rust', 'git2', 'clap', 'GitHub Actions'],
        url: 'https://github.com/JARVIS1069/GIT-archaeologist',
        pages: [
            {
                title: 'The problem',
                text: '"Who knows this code?" Teams ask it when someone leaves, a bug appears in legacy code, or a refactor is planned. Git Archaeologist answers it from commit history.'
            },
            {
                title: 'What it does',
                list: [
                    'Ownership heatmap with time-decay weighting',
                    'Bus factor from the Herfindahl-Hirschman Index',
                    'Per-contributor expertise map and stale-knowledge detection',
                    'Risk alerts: critical, warning, info, healthy',
                    'Departure simulation: what if someone leaves?'
                ]
            },
            {
                title: 'How it works',
                list: [
                    'Each commit adds lines changed, decayed by a configurable half-life (90 days by default), to ownership',
                    'Concentration H = sum of squared ownership shares; bus factor = 1 / H',
                    'Rule-based detection of single points of failure, decay, orphaned files and silent rotting'
                ]
            },
            {
                title: 'In your workflow',
                list: [
                    'CLI commands: scan, risk, expertise, simulate, pr-check',
                    'Table or JSON output',
                    'GitHub Action that comments on PRs and blocks merges that raise critical risk',
                    'Core engine library plus a CLI crate'
                ]
            }
        ]
    },
    {
        name: 'FinTrust',
        description: 'A loan recommendation and EMI app built with Next.js and FastAPI, containerized with Docker, and deployed to Render and Vercel.',
        stack: ['Next.js', 'TypeScript', 'FastAPI', 'SQLite', 'Docker'],
        url: 'https://github.com/JARVIS1069/FinTrust-Loan-Recommendation-System-main',
        pages: [
            {
                title: 'The idea',
                text: 'ML-powered lending: given an applicant profile, the app recommends loan eligibility, product, amount, tenure and interest rate.'
            },
            {
                title: 'Backend',
                list: [
                    'FastAPI service loading pre-trained models (eligibility, product, amount, tenure, rate)',
                    'Label encoders for categorical inputs',
                    'SQLite database for persistent storage',
                    'CORS configured for the frontend origin'
                ]
            },
            {
                title: 'Frontend and delivery',
                list: [
                    'Next.js (TypeScript) app calling the API through NEXT_PUBLIC_API_URL',
                    'docker-compose runs backend and frontend together',
                    'Backend deployed on Render, frontend on Vercel'
                ]
            },
            {
                title: 'Try it',
                text: 'The frontend is live at fintrust-frontend.vercel.app. Source and setup steps are in the repository.'
            }
        ]
    }
]
export const links = {
    github: 'https://github.com/JARVIS1069',
    linkedin: 'https://linkedin.com/in/arpeet-mahajan-3065aa230',
    email: 'mailto:arpeet1104@gmail.com'
}
