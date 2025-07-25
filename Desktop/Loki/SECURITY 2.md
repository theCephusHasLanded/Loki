# 🔒 Constellation Markets - Security Guide

## 🚨 Critical Security Practices

### Environment Variables & Secrets

#### ✅ DO
- **Always use `.env` files** for sensitive configuration
- **Generate strong secrets**: `openssl rand -hex 32`
- **Use different secrets** for each environment (dev/staging/prod)
- **Rotate secrets regularly** (monthly for production)
- **Use secret management services** in production (AWS Secrets Manager, HashiCorp Vault)

#### ❌ NEVER
- **Never commit `.env` files** to version control
- **Never use default/example secrets** in production
- **Never share secrets** in chat, email, or documentation
- **Never hardcode secrets** in source code
- **Never use weak secrets** like "password" or "secret123"

### GitGuardian Protection

We use GitGuardian to scan for leaked secrets. If you receive an alert:

1. **Immediately rotate the compromised secret**
2. **Update all instances** of the secret in your environment
3. **Verify the secret is not exposed** elsewhere
4. **Consider the security impact** and notify the team if needed

### Secret Generation

```bash
# Generate JWT secrets (32 characters)
openssl rand -hex 32

# Generate session secrets (64 characters)  
openssl rand -hex 64

# Generate API keys (if creating custom keys)
openssl rand -base64 48
```

### Environment File Security

#### Local Development
```bash
# Set restrictive permissions
chmod 600 .env

# Verify .env is in .gitignore
grep -q "\.env" .gitignore && echo "✅ Protected" || echo "❌ NOT PROTECTED"
```

#### Production Deployment
- Use cloud secret managers (AWS Secrets Manager, Azure Key Vault)
- Set environment variables directly in deployment platform
- Never store production secrets in files

## 🛡️ Security Checklist

### Pre-Commit Checklist
- [ ] No `.env` files committed
- [ ] No hardcoded secrets in code
- [ ] All example secrets are clearly fake/templated
- [ ] Database passwords are not default values
- [ ] API keys are properly configured for environment

### Repository Security
- [ ] `.gitignore` includes all sensitive file patterns
- [ ] `SECURITY.md` is up to date
- [ ] No sensitive data in commit history
- [ ] Branch protection rules enabled
- [ ] Required reviews for sensitive changes

### Application Security
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled

## 🔑 Secret Types & Handling

### JWT Secrets
- **Purpose**: Token signing and verification
- **Generation**: `openssl rand -hex 32`
- **Rotation**: Monthly in production
- **Storage**: Environment variables only

### Database Credentials
- **Purpose**: Database connection
- **Security**: Use connection pooling, read-only users when possible
- **Rotation**: Quarterly with zero-downtime strategy

### API Keys (Third-party services)
- **Watson AI**: Environment variables with service-specific permissions
- **Stripe**: Use test keys in development, live keys only in production
- **AWS**: IAM roles preferred over access keys

### Session Secrets
- **Purpose**: Session cookie encryption
- **Generation**: `openssl rand -hex 64`
- **Security**: Different secret per environment

## 🚨 Incident Response

### If Secrets Are Compromised

1. **Immediate Actions** (< 1 hour)
   - Rotate all compromised secrets
   - Update applications with new secrets
   - Verify no unauthorized access occurred

2. **Short-term Actions** (< 24 hours)
   - Audit all access logs
   - Check for any suspicious activity
   - Notify relevant team members
   - Update documentation

3. **Long-term Actions** (< 1 week)
   - Review security practices
   - Implement additional protections
   - Conduct security training if needed
   - Update incident response procedures

### Emergency Contacts
- **Security Lead**: [Contact Information]
- **DevOps Team**: [Contact Information]  
- **GitGuardian Support**: support@gitguardian.com

## 📋 Security Tools Integration

### GitGuardian
- Automatically scans for secrets in commits
- Configured for Constellation Markets repository
- Alerts sent to security team email

### Pre-commit Hooks
```bash
# Install pre-commit hooks to catch secrets
pip install pre-commit
pre-commit install

# Configure .pre-commit-config.yaml with secret scanning
```

### GitHub Security Features
- **Dependabot**: Automated dependency updates
- **Code Scanning**: Automated security analysis
- **Secret Scanning**: GitHub's built-in secret detection
- **Security Advisories**: Vulnerability reporting

## 🎯 Best Practices Summary

1. **Environment Isolation**: Separate configs for dev/staging/prod
2. **Least Privilege**: Grant minimum necessary permissions
3. **Regular Audits**: Monthly security reviews
4. **Monitoring**: Log all authentication events
5. **Education**: Keep team updated on security practices

## 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

---

**Remember: Security is everyone's responsibility. When in doubt, ask the security team!**