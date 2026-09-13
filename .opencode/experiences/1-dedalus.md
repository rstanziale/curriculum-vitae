# Dedalus Italia S.p.A.

## Role

- Position: Software Engineer

## Period

- From: September 2018
- To: Present

## Stack

- TypeScript
- Angular
- PrimeNG
- Bootstrap
- Node.Js
- Java
- Vert.x
- MongoDB
- Docker
- OKD
- Git / GitHub
- Confluence
- Jira

## Responsibilities

### Core Product Engineering & Technical Leadership
* **Core Product Ownership:** Lead technical development for the core Anatomical Pathology reporting suite, handling end-to-end design and implementation for critical, high-complexity diagnostic modules used by public and private healthcare providers.
* **Architecture & API Design:** Collaborate with the Product Architect to define technical specifications, data models, and RESTful microservices, ensuring low architectural complexity and high system performance.
* **Third-Party Integration:** Architect and build integration layers connecting backend services to external hospital enterprise systems to consume, aggregate, and display clinical patient data within the client application.
* **Task Delegation & Execution:** Translate high-level business stories into technical requirements on Jira, managing implementation directly or delegating tasks across team members.

### Full-Stack Architecture & Modernization
* **Frontend Architecture:** Maintain and evolve a high-performance Angular monorepo (migrated across Angular versions up to v19/v21) utilizing PrimeNG and Bootstrap, adhering to strict UI/UX standards.
* **Reactive Backend Microservices:** Develop scalable, event-driven backend components using Java with Vert.x event loops and Node.js, backed by MongoDB.
* **API Testing & Service Mocking:** Streamline API workflows using Bruno/Postman for contract testing and Mockoon for virtualizing external clinical data services during development.

### DevOps, Support & Developer Experience
* **Containerization & Deployment:** Dockerize application components and manage deployments on OKD/OpenShift platforms, driving the transition toward pure Docker setups to ensure Kubernetes compliance.
* **CI/CD Migration:** Support build pipeline maintenance and transition legacy build scripts toward GitHub Actions.
* **Documentation & Technical Standards:** Author and maintain comprehensive technical documentation on Confluence, covering API endpoints, deployment protocols, and coding conventions.
* **Delivery Support & Issue Resolution:** Facilitate technical guidance and troubleshooting for delivery teams during customer installations, upgrades, and edge cases.

### Leadership, Recruiting & Mentorship
* **Technical Recruiting:** Conduct technical interviews for engineering candidates, evaluating candidates with a heavy focus on frontend architecture and TypeScript/Angular expertise.
* **Onboarding & Facilitation:** Serve as technical mentor and team facilitator; successfully onboarded 5+ engineers, reducing time-to-autonomy to ~6 months for junior team members.

---

## Key Achievements & Case Studies (STAR Method)

### Inter-Window Communication & Handshake Architecture
* **Situation:** The application layout relies on multiple browser windows (Master/Slave model), requiring frequent synchronization of clinical context data.
* **Task:** Refactor the inter-window communication mechanism to eliminate lag, prevent sync failures, and improve overall system responsiveness and code maintainability.
* **Action:** Designed and implemented a custom handshake protocol using a ping/polling mechanism between the Master page and newly opened Slave windows. Once the Slave responds with "pong", an automated sync sequence transmits all required context data.
* **Result:** Replaced brittle legacy communication with a flexible, high-performance architecture, noticeably reducing sync overhead and simplifying the underlying codebase.

### Onboarding & Mentorship Efficiency
* **Situation:** High complexity of the clinical domain and fragmented documentation led to prolonged ramp-up times for new engineers joining the team.
* **Task:** Reduce learning curves, standardize onboarding protocols, and foster autonomy among less experienced team members.
* **Action:** Documented architectural standards, coding conventions, projects starters, and setup guides in Confluence while leading hands-on technical pairing and code reviews.
* **Result:** Facilitated onboarding for 5+ developers, enabling junior engineers to reach full operational autonomy in approximately 6 months.

### Delivery Support Optimization via Structured Diagnostics
* **Situation:** Field delivery and operations teams encountered complex technical issues during customer deployments that required fast turnaround times from core engineering.
* **Task:** Improve delivery support efficiency and streamline issue resolution without pulling core developers into unstructured troubleshooting.
* **Action:** Implemented a standardized intake workflow requiring delivery teams to submit structured diagnostic packages (including system logs and HAR files) backed by updated Confluence troubleshooting guides.
* **Result:** Enabled rapid diagnostic analysis and resolution of edge-case deployment issues, resulting in faster incident turnaround and stable software upgrades.