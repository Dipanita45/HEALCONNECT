name: 🐞 Bug Report
description: Report a bug for Apertre'26
title: "[Bug]: "
labels: ["apertre3.0", "bug"]
body:
  - type: markdown
    attributes:
      value: |
        # 🚨 Apertre'26 Rule:
        **You MUST select ONE difficulty tag (`easy`, `medium`, or `hard`) after creating this issue.**

  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: What happened? What did you expect?
      placeholder: Describe the issue clearly...
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce the bug?
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. See error
    validations:
      required: true
      
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What should happen?
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: Mandatory for UI bugs!
    validations:
      required: false