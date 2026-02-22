## Security Policy
### Supported Versions
The following versions of HealConnect are currently supported with security updates:
| Version | Supported |
| ------- | --------- |
| 1.x.x   | ✅ Supported |
| 0.x.x   | ❌ Not supported |

---

### About HEALCONNECT
HEALCONNECT is a smart health monitoring system designed to help hospitals manage patient health parameters remotely. Our goal is to enable doctors to access patient data anytime, anywhere — enabling faster and better treatment decisions.

As a platform handling sensitive medical data, we take our security posture extremely seriously. We are committed to working with security researchers to verify and patch any discovered vulnerabilities.

---

### In-Scope vs Out-Of-Scope
**In-Scope:**
- Authentication bypass or Privilege Escalation (e.g., Patient accessing Admin controls)
- Sensitive Patient Data Leaks (e.g., Insecure Direct Object Reference)
- Server-Side Injection (SQLi, NoSQLi, RCE)
- Stored Cross-Site Scripting (XSS)

**Out-Of-Scope:**
- Social Engineering / Phishing attacks against HealConnect staff or hospitals.
- Denial of Service (DoS / DDoS) attacks against the API.
- Missing HTTP security headers (unless a specific exploit chain is provided).
- UI/UX bugs or logic errors that do not affect the CIA (Confidentiality, Integrity, Availability) triad.

---

### Reporting a Vulnerability
If you discover a security vulnerability in HealConnect, we encourage you to report it as soon as possible. 

Please report vulnerabilities by emailing: **dipanitamondal@gmail.com**. Include:
1. A descriptive title and summary of the issue.
2. Step-by-step reproduction instructions.
3. Your assessment of the CVSS severity (see below).
4. Any proof-of-concept (PoC) scripts or screenshots.

---

### Vulnerability Severity Classification (CVSS)
We classify vulnerabilities to prioritize our response to critical Patient Data Leaks over standard UI glitches:
- **Critical:** Direct exposure of patient medical records (PII/PHI), Remote Code Execution, Auth Bypass.
- **High:** Privilege escalation, Stored XSS impacting other users, unauthorized database modifications.
- **Medium:** Reflected XSS, CSRF on non-critical actions.
- **Low:** Minimal impact bugs (e.g., verbose error messages without sensitive data).

---

### Response Timeline (SLA) & Vulnerability Lifecycle
We are committed to the following Service Level Agreements for white-hat reports:
1. **Acknowledgement:** We will acknowledge receipt of your vulnerability report within **24 hours**.
2. **Triaged:** We will confirm the validity and assign a severity rating within **3 days**.
3. **Patched:** We aim to deploy a fix for Critical/High issues within **7 days**, and Medium/Low within 30 days.
4. **Disclosed:** We follow a **90-day standard disclosure policy**. Please do not publicly disclose the vulnerability until it has been patched, or 90 days have passed since the report.

---

### Data Handling Baseline
HealConnect commits to industry-standard data protection. All patient parameters and database reads/writes are encrypted in transit using secure TLS protocols. JWT tokens and session cookies are properly signed and heavily restricted. 

---

### Safe Harbor Statement
When conducting vulnerability research according to this policy, we consider this research to be:
* Authorized in accordance with the Computer Fraud and Abuse Act (CFAA).
* Exempt from the Digital Millennium Copyright Act (DMCA), and we will not bring a claim against you for circumvention of technology controls.
* Legal, and we will not pursue civil action against you for accidental, good-faith violations of this policy.

If legal action is initiated by a third party against you in connection with activities conducted under this policy, we will take steps to make it known that your actions were conducted in compliance with this policy.

---

### Acknowledgements
We appreciate contributions from the community and professional researchers who help us improve the security of HealConnect. Thank you for keeping our platform secure for everyone!
