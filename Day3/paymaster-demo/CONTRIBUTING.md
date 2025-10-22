# Contributing to Paymaster Demo

Thank you for your interest in contributing to the Paymaster Demo project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/paymaster-demo.git
   cd paymaster-demo
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes** thoroughly

4. **Commit your changes** with clear commit messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

## 🎨 Code Style Guidelines

### JavaScript/JSX

- Use **ES6+ syntax** (arrow functions, destructuring, etc.)
- Follow **functional programming** principles where appropriate
- Use **meaningful variable names** (descriptive, not abbreviated)
- Keep functions **small and focused** (single responsibility)
- Add **JSDoc comments** for all exported functions
- Use **async/await** instead of promise chains

### React Components

- Use **functional components** with hooks
- Keep components **modular and reusable**
- Extract complex logic into **custom hooks** or utility functions
- Use **prop destructuring** in component parameters
- Add **PropTypes** or TypeScript types for props

### File Organization

- One component per file
- Group related files in directories
- Use index files for cleaner imports
- Keep utility functions in the `utils/` directory

### Naming Conventions

- **Components**: PascalCase (e.g., `ClaimReward.jsx`)
- **Functions**: camelCase (e.g., `connectWallet`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `REWARDS_ABI`)
- **Files**: kebab-case for utilities (e.g., `payment-service.js`)

### ESLint

Run ESLint before committing:
```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

## 📝 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build config, etc.)

### Examples
```
feat(wallet): add support for multiple wallet providers

fix(transaction): handle paymaster timeout errors correctly

docs(readme): update installation instructions

refactor(utils): simplify transaction status polling logic
```

## 🔍 Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Add tests** for new features
3. **Ensure all tests pass** and linting is clean
4. **Update the README.md** if needed
5. **Reference related issues** in the PR description
6. **Request review** from maintainers
7. **Address review feedback** promptly

### PR Title Format
Use the same format as commit messages:
```
feat(component): add new feature
fix(service): resolve bug
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

## 🧪 Testing

### Manual Testing
1. Test all user flows
2. Test error scenarios
3. Test on different browsers
4. Test responsive design

### Before Submitting
- [ ] Wallet connection works
- [ ] Transaction submission works
- [ ] Error handling works correctly
- [ ] UI is responsive
- [ ] No console errors

## 📚 Documentation

### Code Documentation
- Add **JSDoc comments** for all exported functions
- Include **parameter descriptions** and **return types**
- Add **usage examples** in comments
- Document **complex logic** with inline comments

### README Updates
Update the README.md when:
- Adding new features
- Changing configuration
- Updating dependencies
- Modifying setup process

### Comment Guidelines
- Write comments that explain **why**, not **what**
- Keep comments **up-to-date** with code changes
- Use **clear and concise** language
- Avoid **redundant** comments

## 🐛 Reporting Bugs

When reporting bugs, include:
- **Description** of the bug
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (browser, OS, etc.)
- **Error messages** from console

## 💡 Suggesting Features

When suggesting features, include:
- **Clear description** of the feature
- **Use case** and benefits
- **Potential implementation** approach
- **Alternatives considered**

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Join discussions in existing issues
- Be patient and respectful

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort!

---

**Happy Contributing! 🚀**
