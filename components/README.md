# Components Directory Structure

This directory contains all reusable components for the Bento application.

## Structure

- **`blocks/`** - Individual block components (SocialBlock, ImageBlock, TextBlock, etc.) and the BlockRenderer
- **`layout/`** - Layout components (Container, WidthProvider for grid system)
- **`ui/`** - UI components (BottomToolbar, AddBlockModal, etc.)

## Import Paths

All components should import types from `@/types/block` and `@/types/page`.

Example:

```tsx
import { Block } from "@/types/block";
import SocialBlock from "@/components/blocks/SocialBlock";
```

## Note

The old `core/` and `app/components/` directories may still exist but are deprecated.
All new code should use this `components/` directory structure.
