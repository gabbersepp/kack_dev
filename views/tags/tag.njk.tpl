---
layout: base
pageTitle: Kack.dev - Drawings

pagination:
  data: collections.#tag#
  size: 1
  reverse: true
---

    {%- for item in pagination.items %}
        {% set data = item.data %}
        {% include "img.njk" %}
    {% endfor -%}