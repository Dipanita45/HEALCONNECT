name: 🚀 Feature Request
description: Suggest a feature for Apertre'26
title: "[Feature]: "
labels: ["apertre3.0", "enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        # 🚨 Apertre'26 Rule:
        **You MUST select ONE difficulty tag (`easy`, `medium`, or `hard`) after creating this issue.**

  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: Briefly describe the feature.
    validations:
      required: true

  - type: textarea
    id: motivation
    attributes:
      label: Motivation
      description: Why is this feature important?
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: How should it be implemented?
    validations:
      required: true