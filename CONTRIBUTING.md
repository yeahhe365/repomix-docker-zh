# Contribution Guide

Thanks for your interest in **repomix-local-webui**! We'd love your help to make this local-first Repomix Web UI fork even better. Here's how you can get involved:


- **Create an Issue**: Spot a bug? Have an idea for a new feature? Let us know by creating an issue.
- **Submit a Pull Request**: Found something to fix or improve? Jump in and submit a PR!
- **Spread the Word**: Share your experience with Repomix on social media, blogs, or with your tech community.
- **Use repomix-local-webui**: The best feedback comes from real-world usage, especially local Docker deployments and local-path Web UI workflows.

## Maintainers

This fork is maintained at [yeahhe365/repomix-local-webui](https://github.com/yeahhe365/repomix-local-webui). The core Repomix CLI comes from upstream [yamadashy/repomix](https://github.com/yamadashy/repomix), so changes that only affect the upstream project may be redirected there.

---

## Pull Requests

Before submitting a Pull Request, please ensure:

1. Your code passes all tests: Run `npm run test`
2. Your code adheres to our linting standards: Run `npm run lint`
3. You have updated relevant documentation (especially README.md) if you've added or changed functionality.

## Local Development

To set up this fork for local development:

```bash
git clone https://github.com/yeahhe365/repomix-local-webui.git
cd repomix-local-webui
npm install
```

To run Repomix locally:

```bash
npm run repomix
```

### Docker Usage
You can also run the CLI image using Docker. Here's how:

First, build the Docker image:
```bash
docker build -t repomix .
```

Then, run the Docker container:
```bash
docker run -v ./:/app -it --rm repomix
```

### Coding Style

We use [Biome](https://biomejs.dev/) for linting and formatting. Please make sure your code follows the style guide by running:

```bash
npm run lint
```

### Testing

We use [Vitest](https://vitest.dev/) for testing. To run the tests:

```bash
npm run test
```

For test coverage:

```bash
npm run test-coverage
```

### Documentation

When adding new features or making changes, please update the relevant documentation in the README.md file.

### Website Development

The local Web UI is built with [VitePress](https://vitepress.dev/). To run the packaged website locally with Docker:

```bash
# Prerequisites: Docker must be installed on your system

# Start the local Docker deployment
npm run website

# Access the website at http://localhost:5173/
```

The website source code is located in the `website` directory. The main components are:

- `website/client`: Frontend code (Vue.js components, styles, etc.)
- `website/server`: Backend API server

When updating fork-specific local deployment behavior, please update the relevant website guide pages as well as the README when needed.

## Releasing

New versions are managed by the maintainer. If you think a release is needed, open an issue to discuss it

Thank you for contributing to Repomix!
