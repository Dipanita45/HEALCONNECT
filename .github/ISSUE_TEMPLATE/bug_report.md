name: 🐞 Bug Report
description: Report a bug to help us improve
title: "[Bug]: "
labels: bug
assignees: ''

body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to report a bug!

  - type: input
    id: environment
    attributes:
      label: Environment
      description: OS, browser, or device info
      placeholder: "e.g., Windows 11, Chrome 115"

  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: What happened? What did you expect?
      placeholder: Describe the issue clearly...
      value: ""

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce the bug?
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. Scroll down to '...'
        4. See error