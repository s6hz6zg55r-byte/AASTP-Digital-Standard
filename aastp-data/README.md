Purpose
-------

The repository provides the sole public interface to the AASTP data package.

Consumers must not access JSON files directly.

Public API
----------

repository.getInteractions()

repository.getDistanceRules()

repository.getEffects()

...

Design Principles
-----------------

• JSON structure is an implementation detail.
• Consumers interact only through repository methods.
• Returned objects are treated as read-only.